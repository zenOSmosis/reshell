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

import WindowView from "./Window.View";

// TODO: Implement CodeSandbox support for development / debugging:  https://codesandbox.io/docs/embedding#embed-options
// TODO: Implement simple embed of Speaker.app as a window
// TODO: Lined-paper notes app: https://csslayout.io/patterns/lined-paper

// TODO: See https://csslayout.io/patterns
// TODO: Implement dragging w/ https://use-gesture.netlify.app/docs?
// TODO: https://github.com/pmndrs/react-spring

// TODO: Add prop-types
// TODO: Include option to be able to drag the window from within the window
const Window = React.forwardRef(
  (
    {
      children,

      // TODO: Obtain via windowController instead?
      isActive,

      onRequestMinimize,
      onRequestMaximize,
      onRequestRestore,
      onRequestClose,
      style = {},
      ...rest
    },
    ref
  ) => {
    const [windowController, setWindowController] = useState(null);

    /** @type {DOMElement} */
    // const [el, _setEl] = useState(null);
    // const [elTitlebar, _setElTitlebar] = useState(null);

    // const [zIndex, setZIndex] = useState(0);
    // const [title, setTitle] = useState(null);

    // These are exposed to the WindowManager
    useImperativeHandle(ref, () => ({
      // windowSymbol: Symbol("window"),
      setWindowController,
    }));

    // Fixes issue where calling components would emit warnings such as "Can't
    // perform a React state update on an unmounted component," which is likely
    // caused by the way WindowManager associates the WindowController to this
    // component
    /*
    if (!windowController || windowController.getIsDestroyed()) {
      return null;
    }
    */

    return (
      <WindowView
        {...rest}
        style={style}
        windowController={windowController}
        onRequestMinimize={onRequestMinimize}
        onRequestMaximize={onRequestMaximize}
        onRequestRestore={onRequestRestore}
        onRequestClose={onRequestClose}
        isActive={isActive}
      >
        {children}
      </WindowView>
    );
  }
);

export default Window;
