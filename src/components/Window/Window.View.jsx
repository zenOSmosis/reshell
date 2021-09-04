import { EVT_UPDATED } from "./classes/WindowController";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
// import { useSpring, animated } from "@react-spring/web";
import StackingContext from "../StackingContext";
import Full from "../Full";
import Layout, { Header, Content } from "../Layout";

import WindowBorder from "./Window.Border";

import styles from "./Window.module.css";
import classNames from "classnames";

import { useDrag } from "react-use-gesture";

// TODO: Implement CodeSandbox support for development / debugging:  https://codesandbox.io/docs/embedding#embed-options
// TODO: Implement simple embed of Speaker.app as a window
// TODO: Lined-paper notes app: https://csslayout.io/patterns/lined-paper

// TODO: See https://csslayout.io/patterns
// TODO: Implement dragging w/ https://use-gesture.netlify.app/docs?
// TODO: https://github.com/pmndrs/react-spring

// TODO: Add prop-types
// TODO: Include option to be able to drag the window from within the window
const WindowView = ({
  children,

  windowController,

  // TODO: Obtain via windowController instead?
  isActive,

  onRequestMinimize,
  onRequestMaximize,
  onRequestRestore,
  onRequestClose,
  style = {},
  ...rest
}) => {
  /** @type {DOMElement} */
  const [el, _setEl] = useState(null);

  useEffect(() => {
    if (el && windowController) {
      windowController.setDOMElement(el);
    }
  }, [el, windowController]);

  const [elTitlebar, _setElTitlebar] = useState(null);

  const [zIndex, setZIndex] = useState(0);
  const [title, setTitle] = useState(null);

  useEffect(() => {
    if (windowController) {
      const _handleWindowControllerUpdate = (updatedState) => {
        if (!updatedState) {
          updatedState = windowController.getState() || {};
        }

        if (
          updatedState.title !== undefined &&
          // TODO: Rather than checking dep value here, create conditionally-setting useState wrapper
          updatedState.title !== title
        ) {
          setTitle(updatedState.title);
        }

        if (
          updatedState.stackingIndex !== undefined &&
          // TODO: Rather than checking dep value here, create conditionally-setting useState wrapper
          updatedState.stackingIndex !== zIndex
        ) {
          setZIndex(updatedState.stackingIndex);
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

  // const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const refInitialDragPosition = useRef(null);

  // @see https://use-gesture.netlify.app/docs/#simple-example
  const bind = useDrag(({ down: isDragging, movement: [mx, my], event }) => {
    if (!elTitlebar.contains(event.target)) {
      return;
    }

    // TODO: Refactor dragging logic (i.e. move to WindowManager)
    // TODO: Don't allow dragging out of bounds
    if (isDragging) {
      if (!refInitialDragPosition.current) {
        refInitialDragPosition.current = {
          x: el.offsetLeft,
          y: el.offsetTop,
        };
      }

      el.style.left = refInitialDragPosition.current.x + mx + "px";
      el.style.top = refInitialDragPosition.current.y + my + "px";
    } else {
      refInitialDragPosition.current = null;
    }
  });

  const handleBorderDrag = useCallback((direction, { mx, my, isDragging }) => {
    console.log("TODO: Handle border drag", {
      direction,
      mx,
      my,
      isDragging,
    });
  }, []);

  // TODO: Define elsewhere
  /** @type {boolean} */
  const isWindowBorderDisabled = useMemo(() => {
    if (!windowController) {
      return true;
    } else {
      return (
        windowController.getIsMaximized() || windowController.getIsMinimized()
      );
    }
  }, [windowController]);

  return (
    // TODO: Implement <ErrorBoundary> wrapper (window error boundary)
    <StackingContext
      onMount={_setEl}
      style={{ ...style, zIndex }}
      className={classNames(
        styles["window-outer-border"],
        isActive && styles["active"]
        // isMinimized && styles["minimized"]
      )}
      {...rest}
    >
      <WindowView.Border
        isDisabled={isWindowBorderDisabled}
        onBorderDrag={handleBorderDrag}
      >
        <Full
          {...bind()}
          className={classNames(
            styles["window"],
            isActive && styles["active"]
            // isMinimized && styles["minimized"]
          )}
        >
          <Layout>
            <Header

            // onDoubleClick={handleToggleRestoreOrMaximize}
            >
              <div ref={_setElTitlebar} className={styles["titlebar"]}>
                <div className={styles["title"]}>{title}</div>
                <div className={styles["window-controls"]}>
                  <button onClick={onRequestMinimize}>_</button>
                  <button /* onClick={handleToggleRestoreOrMaximize} */>
                    -
                  </button>
                  <button onClick={onRequestClose}>X</button>
                </div>
              </div>
            </Header>
            <Content>{children}</Content>
          </Layout>
        </Full>
      </WindowView.Border>
    </StackingContext>
  );
};

WindowView.Border = WindowBorder;

export default WindowView;
