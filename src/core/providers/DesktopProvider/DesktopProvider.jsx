import React from "react";

import useActiveWindowController from "./hooks/useActiveWindowController";
import useBackgroundAssetCollection from "./hooks/useBackgroundAssetCollection";

import useServiceClass from "@hooks/useServiceClass";

import UIParadigmService from "@services/UIParadigmService";

export const DesktopContext = React.createContext({});

export default function DesktopProvider({ children }) {
  const { serviceInstance: uiParadigmService } =
    useServiceClass(UIParadigmService);

  const { activeWindowController, setActiveWindowController } =
    useActiveWindowController();
  const { backgroundAssets, addBackgroundAsset, removeBackgroundAsset } =
    useBackgroundAssetCollection();

  return (
    <DesktopContext.Provider
      value={{
        activeWindowController,
        setActiveWindowController,

        paradigm: uiParadigmService.getParadigm(),

        backgroundAssets,
        addBackgroundAsset,
        removeBackgroundAsset,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
}
