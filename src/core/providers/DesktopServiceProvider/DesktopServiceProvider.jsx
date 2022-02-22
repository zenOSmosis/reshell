import React from "react";

import useActiveWindowController from "./hooks/useActiveWindowController";

import useServiceClass from "@hooks/useServiceClass";

import DesktopService from "@services/DesktopService";

export const DesktopServiceContext = React.createContext({});

/**
 * Provides the React app DesktopService UIServiceCore binding.
 */
export default function DesktopServiceProvider({ children }) {
  const { serviceInstance: desktopService } = useServiceClass(DesktopService);

  const desktopState = desktopService.getState();

  useActiveWindowController(desktopState.activeWindowController);

  return (
    <DesktopServiceContext.Provider
      value={{
        ...desktopState,
        setActiveWindowController: desktopService.setActiveWindowController,
        setStaticUIParadigm: desktopService.setStaticUIParadigm,
        setIsProfiling: desktopService.setIsProfiling,
      }}
    >
      {children}
    </DesktopServiceContext.Provider>
  );
}
