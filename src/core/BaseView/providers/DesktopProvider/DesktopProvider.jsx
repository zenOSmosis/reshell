import React from "react";

import useActiveWindowController from "./hooks/useActiveWindowController";
import useBackgroundAssetCollection from "./hooks/useBackgroundAssetCollection";

export const DesktopContext = React.createContext({});

export default function DesktopProvider({ children }) {
  const { activeWindowController, setActiveWindowController } =
    useActiveWindowController();
  const { backgroundAssets, addBackgroundAsset, removeBackgroundAsset } =
    useBackgroundAssetCollection();

  return (
    <DesktopContext.Provider
      value={{
        activeWindowController,
        setActiveWindowController,

        backgroundAssets,
        addBackgroundAsset,
        removeBackgroundAsset,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
}
