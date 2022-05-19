import React from "react";

import useObjectState from "@hooks/useObjectState";

export const WindowContext = React.createContext({});

// TODO: Document (per-window WindowProvider)
// TODO: Use prop-types
export default function WindowProvider({
  children,
  windowController,
  initialSharedState = {},
}) {
  const [sharedState, setSharedState] = useObjectState(initialSharedState);

  return (
    <WindowContext.Provider
      value={{
        setSharedState,
        sharedState,
        windowController,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}
