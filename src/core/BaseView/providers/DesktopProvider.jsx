import { EVT_UPDATED } from "phantom-core";
import React, { useEffect, useState } from "react";

import useForceUpdate from "@hooks/useForceUpdate";

export const DesktopContext = React.createContext({});

const DEFAULT_DOCUMENT_TITLE = document.title;

export default function DesktopProvider({ children }) {
  // TODO: Add all window controllers here so they can be passed to other
  // applications more easily?

  const [activeWindowController, setActiveWindowController] = useState(null);
  const [backgroundVideoMediaStreamTrack, setBackgroundVideoMediaStreamTrack] =
    useState(null);

  // IMPORTANT! This should not be called often as it will force the entire app
  // to re-render
  const forceDesktopUpdate = useForceUpdate();

  // FIXME: (jh) The useEffect won't run if the active window title has
  // changed; forceDesktopUpdate is currently required to make it work,
  // however the goal is to not have DesktopProvider re-render often
  useEffect(() => {
    const _handleUpdate = (updatedState) => {
      if (!activeWindowController) {
        document.title = DEFAULT_DOCUMENT_TITLE;
      } else if (!updatedState || updatedState.title !== undefined) {
        document.title = `${activeWindowController.getTitle()} | ${DEFAULT_DOCUMENT_TITLE}`;

        // Force the entire app to re-render so that the active menu does
        // FIXME: (jh) This shouldn't require a forced update
        forceDesktopUpdate();
      }
    };

    _handleUpdate();

    if (activeWindowController) {
      activeWindowController.on(EVT_UPDATED, _handleUpdate);

      return function unmount() {
        activeWindowController.off(EVT_UPDATED, _handleUpdate);
      };
    }
  }, [activeWindowController, forceDesktopUpdate]);

  return (
    <DesktopContext.Provider
      value={{
        activeWindowController,
        setActiveWindowController,
        backgroundVideoMediaStreamTrack,
        setBackgroundVideoMediaStreamTrack,
        forceDesktopUpdate,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
}
