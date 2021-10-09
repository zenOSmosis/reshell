import React from "react";

import useObjectState from "@hooks/useObjectState";

export const WindowContext = React.createContext({});

export default function WindowProvider({ children, initialSharedState = {} }) {
  const [sharedState, setSharedState] = useObjectState(initialSharedState);

  return (
    <WindowContext.Provider
      value={{
        setSharedState,
        sharedState,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}
