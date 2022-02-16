import React, { useEffect, useState } from "react";
import useDesktopContext from "@hooks/useDesktopContext";

import useAppOrchestrationContext from "@hooks/useAppOrchestrationContext";
import { useHistory, useLocation } from "react-router-dom";

export const WindowManagerRouteContext = React.createContext({});

export default function WindowManagerRouteProvider({ children }) {
  const location = useLocation();
  const { getAppRuntimesWithRegistrationID } = useAppOrchestrationContext();

  const [locationAppRuntimes, setLocationAppRuntimes] = useState([]);

  useEffect(() => {
    // Remove leading forward slash (/) from location
    const locationRegistrationID = location.pathname?.substring(1);

    const locationAppRuntimes = getAppRuntimesWithRegistrationID(
      locationRegistrationID
    );

    setLocationAppRuntimes(locationAppRuntimes);
  }, [location, getAppRuntimesWithRegistrationID]);

  const {
    activeWindowController: desktopContextActiveWindowController,
    // setActiveWindowController: setDesktopContextActiveWindowController,
  } = useDesktopContext();

  const activeRegistrationID = desktopContextActiveWindowController
    ?.getAppRuntime()
    ?.getRegistrationID();

  const history = useHistory();

  // Update URL when active registration changes
  useEffect(() => {
    history.push(activeRegistrationID ? `/${activeRegistrationID}` : "/");
  }, [activeRegistrationID, history]);

  return (
    <WindowManagerRouteContext.Provider value={{ locationAppRuntimes }}>
      {children}
    </WindowManagerRouteContext.Provider>
  );
}
