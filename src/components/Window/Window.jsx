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
    const [windowController, attachWindowController] = useState(null);

    // These are exposed to the WindowManager
    useImperativeHandle(ref, () => ({
      // windowSymbol: Symbol("window"),
      attachWindowController,
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
