import React, { useImperativeHandle, useState } from "react";

import WindowView from "./Window.View";

// TODO: Implement CodeSandbox support for development / debugging:
// https://codesandbox.io/docs/embedding#embed-options

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

      titleBarView,

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
      return null;
    }

    return (
      <WindowView
        {...rest}
        style={style}
        elWindowManager={elWindowManager}
        windowController={windowController}
        isActive={isActive}
        titleBarView={titleBarView}
      >
        {children}
      </WindowView>
    );
  }
);

export default Window;
