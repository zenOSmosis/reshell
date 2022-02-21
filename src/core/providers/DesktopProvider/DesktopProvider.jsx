import React, { useState } from "react";

import useActiveWindowController from "./hooks/useActiveWindowController";

import useServiceClass from "@hooks/useServiceClass";

import UIParadigmService from "@services/UIParadigmService";

export const DesktopContext = React.createContext({});

export default function DesktopProvider({ children }) {
  const [isProfiling, setIsProfiling] = useState(false);

  const { serviceInstance: uiParadigmService } =
    useServiceClass(UIParadigmService);

  const { activeWindowController, setActiveWindowController } =
    useActiveWindowController();

  return (
    <DesktopContext.Provider
      value={{
        activeWindowController,
        setActiveWindowController,

        uiParadigm: uiParadigmService.getUIParadigm(),
        isUIParadigmAutoSet: uiParadigmService.getIsAutoSet(),
        setStaticUIParadigm: uiParadigmService.setStaticUIParadigm,

        isProfiling,
        setIsProfiling,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
}
