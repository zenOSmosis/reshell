import React, { useImperativeHandle, useState } from "react";

import WindowView from "./Window.View";

// TODO: Implement CodeSandbox support for development / debugging:  https://codesandbox.io/docs/embedding#embed-options

// TODO: See https://csslayout.io/patterns

// TODO: Add prop-types
// TODO: Document
// TODO: Include option to be able to drag the window from within the window body (i.e. like a widget)
const Window = React.forwardRef(
  (
    {
      children,
      elWindowManager,

      // TODO: Obtain via windowController instead?
      isActive,

      style = {},
      ...rest
    },
    ref
  ) => {
    const [windowController, attachWindowController] = useState(null);

    // These are exposed to the WindowManager
    useImperativeHandle(ref, () => ({
      // windowSymbol: Symbol("window"),
      attachWindowController,
    }));

    // The windowController should already be supplied by WindowManager before
    // rendering is even attempted
    if (!windowController) {
      console.warn(
        "No window controller available; blocking window render attempt"
      );

      return null;
    }

    // TODO: Implement error boundary here

    return (
      <WindowView
        {...rest}
        // TODO: If wrapping w/ optional profiler, use a key here so that internal view state is not lost?
        style={style}
        elWindowManager={elWindowManager}
        windowController={windowController}
        isActive={isActive}
      >
        {children}
      </WindowView>
    );
  }
);

export default Window;
