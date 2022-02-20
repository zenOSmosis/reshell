import React, { useEffect } from "react";
import debounce from "debounce";

import useDesktopContext from "@hooks/useDesktopContext";
import useLocationAppRegistrationID from "@hooks/useLocationAppRegistrationID";
import useAppOrchestrationContext from "@hooks/useAppOrchestrationContext";

import { useHistory } from "react-router-dom";

export const WindowManagerRouteContext = React.createContext({});

/**
 * Updates React Router location and provides location-based handling for
 * ReShell applications.
 */
export default function WindowManagerRouteProvider({ children }) {
  const { getAppRuntimesWithRegistrationID, activateAppRegistrationID } =
    useAppOrchestrationContext();

  const { activeWindowController, setActiveWindowController } =
    useDesktopContext();

  // Detected app registration ID from React Router URL location
  const locationAppRegistrationID = useLocationAppRegistrationID();

  // Update active app registration based on location changes
  useEffect(() => {
    if (locationAppRegistrationID) {
      // Launch, or bring to front
      activateAppRegistrationID(locationAppRegistrationID);
    } else {
      setActiveWindowController(null);
    }
  }, [
    locationAppRegistrationID,
    getAppRuntimesWithRegistrationID,
    setActiveWindowController,
    activateAppRegistrationID,
  ]);

  // Active window controller app registration ID
  const activeRegistrationID = activeWindowController
    ?.getAppRuntime()
    ?.getRegistrationID();

  const history = useHistory();

  // Update URL when active registration ID changes
  useEffect(() => {
    if (activeRegistrationID !== locationAppRegistrationID) {
      // IMPORTANT: This debounce fixes an issue where the browser could get
      // stuck in an infinite URL redirect loop if in-development and certain
      // host files were updated. Firefox could still see the issue present
      // with a lower debounce time (of 0).
      // @see https://github.com/jzombie/pre-re-shell/issues/129
      const handleRegistrationOrLocationChange = debounce(
        () =>
          history.push(activeRegistrationID ? `/${activeRegistrationID}` : "/"),

        50,
        false
      );

      handleRegistrationOrLocationChange();

      return () => handleRegistrationOrLocationChange.clear();
    }
  }, [activeRegistrationID, locationAppRegistrationID, history]);

  return (
    <WindowManagerRouteContext.Provider value={{}}>
      {children}
    </WindowManagerRouteContext.Provider>
  );
}
