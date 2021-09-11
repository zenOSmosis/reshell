import { EVT_UPDATED } from "./classes/WindowController";
import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { useSpring, animated } from "@react-spring/web";
import StackingContext from "../StackingContext";
import Full from "../Full";
import Layout, { Header, Content } from "../Layout";

import WindowBorder from "./Window.Border";

import styles from "./Window.module.css";
import classNames from "classnames";

import useWindowDragger from "./hooks/useWindowDragger";
import useWindowDragResizer from "./hooks/useWindowDragResizer";

// TODO: Add prop-types
// TODO: Document
// TODO: Include option to be able to drag the window from within the window body (i.e. like a widget)
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

  const [elTitlebar, _setElTitlebar] = useState(null);

  const [zIndex, setZIndex] = useState(0);
  const [title, setTitle] = useState(null);

  // Associate window element with window controller
  useEffect(() => {
    if (windowController && el) {
      windowController.attachWindowElement(el);
    }
  }, [windowController, el]);

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

  // Binds window dragging functionality
  const dragBind = useWindowDragger({ windowController, elTitlebar });

  // TODO: Refactor into useWindowDragBorder
  const handleBorderDrag = useCallback((direction, { mx, my, isDragging }) => {
    console.log("TODO: Handle border drag", {
      direction,
      mx,
      my,
      isDragging,
    });
  }, []);

  const isWindowBorderDisabled = windowController.getIsBorderDisabled();

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
          {...dragBind()}
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
