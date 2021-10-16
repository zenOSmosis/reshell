import React, { useCallback, useContext, useEffect, useMemo } from "react";
import AppRuntimeOrchestrationService, {
  EVT_UPDATED,
} from "./services/AppRuntimeOrchestrationService";

import { AppRegistrationsContext } from "../AppRegistrationsProvider";

import { UIServicesContext } from "../UIServicesProvider";

import useForceUpdate from "@hooks/useForceUpdate";
import useAppRuntimesAutoStart from "./useAppRuntimesAutoStart";

export const AppRuntimesContext = React.createContext({});

// TODO: Document
export default function AppRuntimesProvider({ children }) {
  const { appRegistrations } = useContext(AppRegistrationsContext);

  const { startService } = useContext(UIServicesContext);
  const forceUpdate = useForceUpdate();

  // TODO: Document
  const appOrchestrationService = useMemo(
    () => startService(AppRuntimeOrchestrationService),
    [startService]
  );

  // TODO: Document
  const appRuntimes = appOrchestrationService.getAppRuntimes();

  // TODO: Import type definition
  /** @type {AppRegistration[]} */
  const runningRegistrations = useMemo(
    () => appRuntimes.map(runtime => runtime.getRegistration()),
    [appRuntimes]
  );

  // TODO: Document
  useEffect(() => {
    appOrchestrationService.on(EVT_UPDATED, forceUpdate);

    return function unmount() {
      appOrchestrationService.off(EVT_UPDATED, forceUpdate);
    };
  }, [appOrchestrationService, forceUpdate]);

  // TODO: Document
  const startAppRuntime = useCallback(
    appRegistration => {
      return appOrchestrationService.startAppRuntime(appRegistration);
    },
    [appOrchestrationService]
  );

  // TODO: Merge with startAppRuntime after descriptors can specify multiple
  // window support
  //
  // TODO: Debounce this call (starts to bog down if repeatedly pressing app button)
  const bringToFrontOrStartAppRuntime = useCallback(
    appRegistration => {
      if (!runningRegistrations.includes(appRegistration)) {
        // TODO: Open app w/ registration
        startAppRuntime(appRegistration);
      } else {
        // Move grouped windows to top
        // TODO: Order by window manager stacking order (most recently used
        // window in group should appear in top)
        // TODO: Refactor into window manager?
        appRuntimes
          .filter(runtime => runtime.getRegistration() === appRegistration)
          .forEach(runtime => runtime.bringToTop());
      }
    },
    [runningRegistrations, appRuntimes, startAppRuntime]
  );

  // TODO: Document (for linking to other windows)
  const switchToAppRegistrationID = useCallback(
    appRegistrationID => {
      const appRegistration = appRegistrations.find(
        predicate => predicate.getID() === appRegistrationID
      );

      if (!appRegistration) {
        console.warn(`Unknown appRegistration with id: ${appRegistrationID}`);
      } else {
        bringToFrontOrStartAppRuntime(appRegistration);
      }
    },
    [appRegistrations, bringToFrontOrStartAppRuntime]
  );

  // TODO: Document
  const stopAppRuntime = useCallback(
    appRegistration => {
      return appOrchestrationService.stopAppRuntime(appRegistration);
    },
    [appOrchestrationService]
  );

  // TODO: Document
  const getAppRuntimesWithRegistrationID = useCallback(
    registrationID =>
      appRuntimes.filter(
        appRuntime => appRuntime.getRegistrationID() === registrationID
      ),
    [appRuntimes]
  );

  // TODO: Document
  useAppRuntimesAutoStart({
    appRegistrations,
    startAppRuntime,
  });

  return (
    <AppRuntimesContext.Provider
      value={{
        startAppRuntime,
        stopAppRuntime,
        appRuntimes,
        getAppRuntimesWithRegistrationID,
        runningRegistrations,
        bringToFrontOrStartAppRuntime,
        switchToAppRegistrationID,
      }}
    >
      {children}
    </AppRuntimesContext.Provider>
  );
}
