import { EVT_UPDATED } from "./classes/WindowController";
import React, { useEffect, useMemo, useRef, useState } from "react";
import StackingContext from "../StackingContext";
import Full from "../Full";
import Layout, { Header, Content } from "../Layout";

import WindowBorder from "./Window.Border";
import WindowTitleBar from "./Window.TitleBar";

import styles from "./Window.module.css";
import classNames from "classnames";

import useWindowStyles from "./hooks/useWindowStyles";
import useWindowAutoPositioner from "./hooks/useWindowAutoPositioner";
import useWindowAutoSizer from "./hooks/useWindowAutoSizer";
import useWindowDragger from "./hooks/useWindowDragger";
import useWindowDragResizer from "./hooks/useWindowDragResizer";
import useWindowOpenAnimation from "./hooks/useWindowOpenAnimation";
import useWindowControls from "./hooks/useWindowControls";

import useDesktopContext from "@hooks/useDesktopContext";

// TODO: Apply considerations from Apple's Human Interface Guidelines:
// https://developer.apple.com/design/human-interface-guidelines/macos/windows-and-views/window-anatomy/

// TODO: Consider adjusting tabindex for non-active windows dynamically so that
// tabbing will stay within constraints of the active window
// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex

// TODO: Add prop-types
// TODO: Document
// TODO: Include option to be able to drag the window from within the window body (i.e. like a widget)
const WindowView = ({
  children,
  elWindowManager,

  windowController,

  // TODO: Obtain via windowController instead?
  isActive,

  titleBarView = null,

  style = {},
  ...rest
}) => {
  /** @type {DOMElement} */
  const [elWindow, _setElWindow] = useState(null);

  // TODO: Document
  const { isOpenAnimationEnded } = useWindowOpenAnimation(elWindow);

  // TODO: Document
  useWindowAutoPositioner({ elWindow, elWindowManager, windowController });

  // TODO: Document
  useWindowAutoSizer({ windowController });

  const [zIndex, _setZIndex] = useState(0);
  const [title, _setTitle] = useState(null);
  const refTitle = useRef(null);
  refTitle.current = title;

  // Associate window element with window controller
  // TODO: Refactor into useWindowController hook
  useEffect(() => {
    if (windowController && elWindow) {
      windowController.__INTERNAL__attachWindowElement(elWindow);
    }
  }, [windowController, elWindow]);

  /** @type {boolean} */
  const [isWindowBorderDisabled, _setIsWindowBorderDisabled] = useState(false);
  const refIsWindowBorderDisabled = useRef(null);
  refIsWindowBorderDisabled.current = isWindowBorderDisabled;

  const [isMaximized, _setIsMaximized] = useState(false);
  const [isMinimized, _setIsMinimized] = useState(false);

  // TODO: Document
  // TODO: Refactor into useWindowController hook
  // TODO: Move into container view?
  useEffect(() => {
    if (windowController) {
      const _handleWindowControllerUpdate = updatedState => {
        if (!updatedState) {
          updatedState = windowController.getState() || {};
        }

        // Only apply view state change when necessary
        const windowTitle = windowController.getTitle();
        if (windowTitle !== refTitle.current) {
          _setTitle(windowTitle);
        }

        // Only apply view state change when necessary
        if (
          updatedState.stackingIndex !== undefined &&
          // TODO: Rather than checking dep value here, create conditionally-setting useState wrapper
          updatedState.stackingIndex !== zIndex
        ) {
          _setZIndex(updatedState.stackingIndex);
        }

        if (updatedState.isMaximized !== undefined) {
          _setIsMaximized(updatedState.isMaximized);
        }

        if (updatedState.isMinimized !== undefined) {
          _setIsMinimized(updatedState.isMinimized);
        }

        const shouldWindowBorderBeDisabled =
          windowController.getIsBorderDisabled();
        if (
          refIsWindowBorderDisabled.current !== shouldWindowBorderBeDisabled
        ) {
          _setIsWindowBorderDisabled(shouldWindowBorderBeDisabled);
        }
      };

      // Perform initial update sync
      _handleWindowControllerUpdate();

      windowController.on(EVT_UPDATED, _handleWindowControllerUpdate);

      return function unmount() {
        windowController.off(EVT_UPDATED, _handleWindowControllerUpdate);
      };
    }
  }, [windowController, title, zIndex]);

  const { onRestoreOrMaximize, onMinimize, onClose } = useWindowControls({
    windowController,
  });

  // Binds window dragging functionality
  const [dragBind, isUserDragging] = useWindowDragger({
    windowController,
    isDisabled: isWindowBorderDisabled,
  });

  // Binds border resizing functionality
  const [handleBorderDrag, isUserResizing] = useWindowDragResizer({
    windowController,
  });

  const { isProfiling } = useDesktopContext();

  // TODO: Document
  const DynamicProfilingWrapper = useMemo(
    () =>
      ({ ...args }) =>
        isProfiling ? (
          // @see https://reactjs.org/docs/profiler.html
          <React.Profiler
            {...args}
            id={windowController.getUUID()}
            onRender={(...renderProfile) =>
              windowController.captureRenderProfile(renderProfile)
            }
          />
        ) : (
          <React.Fragment {...args} />
        ),
    [isProfiling, windowController]
  );

  // Delegate style properties to their respective sub-components
  const { outerBorderStyle, windowStyle, bodyStyle } = useWindowStyles({
    style,
    isMaximized,
    isMinimized,
  });

  return (
    // TODO: Wrap with ErrorBoundary and React.Suspense
    <StackingContext
      ref={_setElWindow}
      {...rest}
      style={{ ...outerBorderStyle, zIndex }}
      className={classNames(
        styles["window-outer-border"],

        // Prevents "popping" of window before open animation ends
        !isOpenAnimationEnded && styles["hidden"],

        isActive && styles["active"],
        isMaximized && styles["maximized"],
        isMinimized && styles["minimized"],
        (isUserDragging || isUserResizing) && styles["dragging"]
      )}
      // Enable hardware acceleration of window stacking context when user is
      // dragging or resizing
      isAccelerated={isUserDragging || isUserResizing}
      // For debugging reference
      data-reshell-window-title={windowController.getTitle()}
    >
      {
        // IMPORTANT: The DynamicProfilingWrapper is contained within the
        // stacking context due to an issue w/ the window losing its
        // positioning state if profiling is enabled / disabled
      }
      <DynamicProfilingWrapper>
        <WindowView.Border
          isDisabled={isWindowBorderDisabled}
          onBorderDrag={handleBorderDrag}
        >
          <Full
            className={classNames(
              styles["window"],
              isActive && styles["active"],
              // NOTE: This check intentionally is not taking resizing into
              // consideration
              isUserDragging && styles["dragging"]
            )}
            style={windowStyle}
          >
            <Layout>
              <Header>
                <WindowTitleBar
                  {...dragBind()}
                  title={title}
                  onRestoreOrMaximize={onRestoreOrMaximize}
                  onMinimize={onMinimize}
                  onClose={onClose}
                  titleBarView={titleBarView}
                />
              </Header>
              <Content className={styles["body"]} style={bodyStyle}>
                {children}
              </Content>
            </Layout>
          </Full>
        </WindowView.Border>
      </DynamicProfilingWrapper>
    </StackingContext>
  );
};

WindowView.Border = WindowBorder;

export default WindowView;
