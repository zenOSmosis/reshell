import React, { useCallback, useContext, useEffect, useMemo } from "react";
import AppRuntimeOrchestrationService, {
  EVT_UPDATED,
} from "./services/AppRuntimeOrchestrationService";

import { UIServicesContext } from "../UIServicesProvider";

import useForceUpdate from "@hooks/useForceUpdate";

export const AppRuntimesContext = React.createContext({});

// TODO: Document
export default function AppRuntimesProvider({ children }) {
  const { startService } = useContext(UIServicesContext);
  const forceUpdate = useForceUpdate();

  // TODO: Document
  const appOrchestrationService = useMemo(
    () => startService(AppRuntimeOrchestrationService),
    [startService]
  );

  // TODO: Document
  useEffect(() => {
    appOrchestrationService.on(EVT_UPDATED, () => {
      forceUpdate();
    });
  }, [appOrchestrationService, forceUpdate]);

  // TODO: Document
  const startAppRuntime = useCallback(
    (appRegistration) => {
      appOrchestrationService.startAppRuntime(appRegistration);
    },
    [appOrchestrationService]
  );

  // TODO: Document
  const stopAppRuntime = useCallback(
    (appRegistration) => {
      appOrchestrationService.stopAppRuntime(appRegistration);
    },
    [appOrchestrationService]
  );

  // TODO: Document
  const appRuntimes = appOrchestrationService.getAppRuntimes();

  // TODO: Document
  const getAppRuntimesWithRegistrationID = useCallback(
    (registrationID) =>
      appRuntimes.filter(
        (appRuntime) => appRuntime.getRegistrationID() === registrationID
      ),
    [appRuntimes]
  );

  return (
    <AppRuntimesContext.Provider
      value={{
        startAppRuntime,
        stopAppRuntime,
        appRuntimes,
        getAppRuntimesWithRegistrationID,
      }}
    >
      {children}
    </AppRuntimesContext.Provider>
  );
}
