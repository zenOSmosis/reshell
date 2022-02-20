import React from "react";

import useActiveWindowController from "./hooks/useActiveWindowController";

import useServiceClass from "@hooks/useServiceClass";

import UIParadigmService from "@services/UIParadigmService";

export const DesktopContext = React.createContext({});

export default function DesktopProvider({ children }) {
  const { serviceInstance: uiParadigmService } =
    useServiceClass(UIParadigmService);

  const { activeWindowController, setActiveWindowController } =
    useActiveWindowController();

  return (
    <DesktopContext.Provider
      value={{
        activeWindowController,
        setActiveWindowController,

        paradigm: uiParadigmService.getParadigm(),
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
}
