import { EVT_UPDATED } from "phantom-core";
import { useEffect } from "react";
import WindowController from "@components/Window/classes/WindowController";

import useForceUpdate from "@hooks/useForceUpdate";

// FIXME: (jh) Refactor [native] window title setting
const INITIAL_DOCUMENT_TITLE = document.title;

// FIXME: (jh) [consider using active element to help determine active controller in certain situations]
// https://github.com/facebook/react/blob/main/packages/react-dom/src/client/getActiveElement.js

/**
 * Manages setting of the HTML document title and related effects when the
 * active window controller is changed.
 *
 * @param {WindowController | null} activeWindowController
 * @return {void}
 */
export default function useActiveWindowController(activeWindowController) {
  if (
    activeWindowController !== null &&
    !(activeWindowController instanceof WindowController)
  ) {
    throw new TypeError("activeWindowController must be a WindowController");
  }

  // IMPORTANT! This should not be called often as it will force the entire app
  // to re-render
  //
  // FIXME: (jh) This can probably be removed now that the active window
  // controller is managed by a service
  const forceDesktopUpdate = useForceUpdate();

  // FIXME: (jh) The useEffect won't run if the active window title has
  // changed; forceDesktopUpdate is currently required to make it work,
  // however the goal is to not have DesktopProvider re-render often
  useEffect(() => {
    const _handleUpdate = updatedState => {
      // FIXME: (jh) Refactor [native] window title setting
      if (!activeWindowController) {
        document.title = INITIAL_DOCUMENT_TITLE;
      } else if (!updatedState || updatedState.title !== undefined) {
        document.title = `${activeWindowController.getTitle()} | ${INITIAL_DOCUMENT_TITLE}`;

        // Force the entire app to re-render so that the active menu does
        // FIXME: (jh) This shouldn't require a forced update of the entire
        // app; Dock / misc. items should listen to active window controller,
        // or its related AppRuntime, itself
        forceDesktopUpdate();
      }
    };

    // Perform initial update to set document title, if exists
    _handleUpdate();

    if (activeWindowController) {
      activeWindowController.on(EVT_UPDATED, _handleUpdate);

      return function unmount() {
        activeWindowController.off(EVT_UPDATED, _handleUpdate);
      };
    }
  }, [activeWindowController, forceDesktopUpdate]);
}
