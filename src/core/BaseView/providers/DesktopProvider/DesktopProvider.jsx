import React from "react";

import useActiveWindowController from "./hooks/useActiveWindowController";

export const DesktopContext = React.createContext({});

export default function DesktopProvider({ children }) {
  const { activeWindowController, setActiveWindowController } =
    useActiveWindowController();

  return (
    <DesktopContext.Provider
      value={{
        activeWindowController,
        setActiveWindowController,
        // backgroundVideoMediaStreamTrack,
        // setBackgroundVideoMediaStreamTrack,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
}
