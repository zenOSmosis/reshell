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
// TODO: Document
// TODO: Include option to be able to drag the window from within the window body (i.e. like a widget)
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

    // These are exposed to the WindowManager
    useImperativeHandle(ref, () => ({
      // windowSymbol: Symbol("window"),
      setWindowController,
    }));

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
