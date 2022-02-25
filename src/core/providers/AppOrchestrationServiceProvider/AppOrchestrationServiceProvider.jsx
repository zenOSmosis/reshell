import React, { useEffect } from "react";

import useServiceClass from "@hooks/useServiceClass";

import AppOrchestrationService from "@services/AppOrchestrationService";

import useAppRuntimesAutoStart from "./useAppRuntimesAutoStart";

export const AppOrchestrationServiceContext = React.createContext({});

/**
 * Provides the React application with ReShell app orchestration servicing.
 */
export default function AppOrchestrationServiceProvider({ children }) {
  const { serviceInstance: appOrchestrationService } = useServiceClass(
    AppOrchestrationService
  );

  const runningAppRegistrations =
    appOrchestrationService.getRunningAppRegistrations();
  const appRegistrations = appOrchestrationService.getAppRegistrations();
  const appRuntimes = appOrchestrationService.getAppRuntimes();

  // TODO: If enabling, this needs to be memoized (or contained within a
  // phantom collection)
  /*
  const windowControllers = appRuntimes
    .map(runtime => runtime.getWindowController())
    // Don't include runtimes without window controllers
    .filter(pred => pred);
  */

  const activateAppRegistration =
    appOrchestrationService.activateAppRegistration;
  const activateAppRegistrationWithID =
    appOrchestrationService.activateAppRegistrationWithID;
  const addOrUpdateAppRegistration =
    appOrchestrationService.addOrUpdateAppRegistration;
  const getAppRegistrationTitleWithID =
    appOrchestrationService.getAppRegistrationTitleWithID;
  const getAppRuntimesWithRegistrationID =
    appOrchestrationService.getAppRuntimesWithRegistrationID;

  // TODO: Remove
  useEffect(() => {
    console.log({ appRegistrations });
  }, [appRegistrations]);

  // TODO: Remove
  useEffect(() => {
    console.log({ appRuntimes });
  }, [appRuntimes]);

  // Handles auto-start of apps which are set to automatically launch
  //
  // FIXME: (jh) Refactor using a different approach
  useAppRuntimesAutoStart(appRegistrations, activateAppRegistration);

  return (
    <AppOrchestrationServiceContext.Provider
      value={{
        runningAppRegistrations,
        appRegistrations,
        appRuntimes,
        // windowControllers,
        //
        activateAppRegistration,
        activateAppRegistrationWithID,
        addOrUpdateAppRegistration,
        getAppRegistrationTitleWithID,
        getAppRuntimesWithRegistrationID,
      }}
    >
      {children}
    </AppOrchestrationServiceContext.Provider>
  );
}
