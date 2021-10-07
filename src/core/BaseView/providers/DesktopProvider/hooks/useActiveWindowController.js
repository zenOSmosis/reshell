import { EVT_UPDATED } from "phantom-core";
import { useEffect, useState } from "react";

import useForceUpdate from "@hooks/useForceUpdate";
// import useServicesContext from "@hooks/useServicesContext";
// import AppRuntimeOrchestrationService from "../../AppRuntimesProvider/services/AppRuntimeOrchestrationService";

// TODO: Refactor [native] window title setting
const DEFAULT_DOCUMENT_TITLE = document.title;

// TODO: [consider using active element to help determine active controller in certain situations]
// https://github.com/facebook/react/blob/main/packages/react-dom/src/client/getActiveElement.js

// TODO: Document
export default function useActiveWindowController() {
  const [activeWindowController, setActiveWindowController] = useState(null);
  // const [backgroundVideoMediaStreamTrack, setBackgroundVideoMediaStreamTrack] = useState(null);

  /*
  const appOrchestrationService = useServiceClass(
    AppRuntimeOrchestrationService
  );
  */

  // TODO: Remove
  // TODO: Mirror active window controller w/ AppRuntimeOrchestrationService (maybe have useActiveWindowController reflect orchestration state)
  // const { services } = useServicesContext();
  // console.log({ services });

  // IMPORTANT! This should not be called often as it will force the entire app
  // to re-render
  const forceDesktopUpdate = useForceUpdate();

  // FIXME: (jh) The useEffect won't run if the active window title has
  // changed; forceDesktopUpdate is currently required to make it work,
  // however the goal is to not have DesktopProvider re-render often
  useEffect(() => {
    const _handleUpdate = updatedState => {
      // TODO: Refactor [native] window title setting
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

  return {
    activeWindowController,
    setActiveWindowController,
  };
}
