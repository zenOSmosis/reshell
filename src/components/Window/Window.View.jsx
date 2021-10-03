import { EVT_UPDATED } from "./classes/WindowController";
import React, { useEffect, useMemo, useRef, useState } from "react";
import StackingContext from "../StackingContext";
import Full from "../Full";
import Layout, { Header, Content } from "../Layout";

import WindowBorder from "./Window.Border";
import WindowTitlebar from "./Window.Titlebar";

import styles from "./Window.module.css";
import classNames from "classnames";

import useWindowStyles from "./hooks/useWindowStyles";
import useWindowAutoPositioner from "./hooks/useWindowAutoPositioner";
import useWindowDragger from "./hooks/useWindowDragger";
import useWindowDragResizer from "./hooks/useWindowDragResizer";
import useWindowOpenAnimation from "./hooks/useWindowOpenAnimation";
import useWindowControls from "./hooks/useWindowControls";

// TODO: Apply considerations from Apple's Human Interface Guidelines:
// https://developer.apple.com/design/human-interface-guidelines/macos/windows-and-views/window-anatomy/

// TODO: Add prop-types
// TODO: Document
// TODO: Include option to be able to drag the window from within the window body (i.e. like a widget)
const WindowView = ({
  children,
  elWindowManager,

  windowController,

  // TODO: Obtain via windowController instead?
  isActive,

  // TODO: Obtain via windowController
  isProfiling = true,

  style = {},
  ...rest
}) => {
  /** @type {DOMElement} */
  const [el, _setEl] = useState(null);

  // TODO: Document
  const { isOpenAnimationEnded } = useWindowOpenAnimation(el);

  // TODO: Document
  useWindowAutoPositioner(elWindowManager, el, windowController);

  const [elTitlebar, _setElTitlebar] = useState(null);

  const [zIndex, _setZIndex] = useState(0);
  const [title, _setTitle] = useState(null);

  // Associate window element with window controller
  // TODO: Refactor into useWindowController hook
  useEffect(() => {
    if (windowController && el) {
      windowController.attachWindowElement(el);
    }
  }, [windowController, el]);

  /** @type {boolean} */
  const [isWindowBorderDisabled, _setIsWindowBorderDisabled] = useState(false);
  const refIsWindowBorderDisabled = useRef(null);
  refIsWindowBorderDisabled.current = isWindowBorderDisabled;

  const [isMaximized, _setIsMaximized] = useState(false);
  const [isMinimized, _setIsMinimized] = useState(false);

  // TODO: Document
  // TODO: Refactor into useWindowController hook
  useEffect(() => {
    if (windowController) {
      const _handleWindowControllerUpdate = updatedState => {
        if (!updatedState) {
          updatedState = windowController.getState() || {};
        }

        // Only apply view state change when necessary
        if (
          updatedState.title !== undefined &&
          // TODO: Rather than checking dep value here, create conditionally-setting useState wrapper
          updatedState.title !== title
        ) {
          _setTitle(updatedState.title);
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

  const { onRestoreOrMaximize, onMinimize, onClose } =
    useWindowControls(windowController);

  // Binds window dragging functionality
  const [dragBind, isUserDragging] = useWindowDragger({
    windowController,
    elTitlebar,
    isDisabled: isWindowBorderDisabled,
  });

  // Binds border resizing functionality
  const [handleBorderDrag, isUserResizing] = useWindowDragResizer({
    windowController,
  });

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
    <DynamicProfilingWrapper>
      <StackingContext
        onMount={_setEl}
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
        // Enable hardware acceleration of window stacking context
        isAccelerated={true}
      >
        <WindowView.Border
          isDisabled={isWindowBorderDisabled}
          onBorderDrag={handleBorderDrag}
        >
          <Full
            {...dragBind()}
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
                <WindowTitlebar
                  onElTitlebar={_setElTitlebar}
                  title={title}
                  onRestoreOrMaximize={onRestoreOrMaximize}
                  onMinimize={onMinimize}
                  onClose={onClose}
                />
              </Header>
              <Content className={styles["body"]} style={bodyStyle}>
                {children}
              </Content>
            </Layout>
          </Full>
        </WindowView.Border>
      </StackingContext>
    </DynamicProfilingWrapper>
  );
};

WindowView.Border = WindowBorder;

export default WindowView;
