import React, { useCallback, useContext, useEffect, useMemo } from "react";
import AppRuntimeOrchestrationService, {
  EVT_UPDATED,
} from "./services/AppRuntimeOrchestrationService";

import { UIServicesContext } from "../UIServicesProvider";

import useForceUpdate from "@hooks/useForceUpdate";

export const AppRuntimesContext = React.createContext({});

export default function AppRuntimesProvider({ children }) {
  const { startService } = useContext(UIServicesContext);
  const forceUpdate = useForceUpdate();

  const appOrchestrationService = useMemo(
    () => startService(AppRuntimeOrchestrationService),
    [startService]
  );

  useEffect(() => {
    appOrchestrationService.on(EVT_UPDATED, () => {
      forceUpdate();
    });
  }, [appOrchestrationService, forceUpdate]);

  const startAppRuntime = useCallback(
    (appRegistration) => {
      appOrchestrationService.startAppRuntime(appRegistration);
    },
    [appOrchestrationService]
  );

  const stopAppRuntime = useCallback(
    (appRegistration) => {
      appOrchestrationService.stopAppRuntime(appRegistration);
    },
    [appOrchestrationService]
  );

  return (
    <AppRuntimesContext.Provider
      value={{
        startAppRuntime,
        stopAppRuntime,
        appRuntimes: appOrchestrationService.getAppRuntimes(),
      }}
    >
      {children}
    </AppRuntimesContext.Provider>
  );
}
