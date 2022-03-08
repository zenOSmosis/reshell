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

  // Sort app registrations in place
  //
  // FIXME: (jh) It would be better to move this functionality into the
  // collection itself; this also might not handle situations where updating
  // a registration title during runtime will automatically re-apply the sort.
  // Relevant issue: https://github.com/jzombie/pre-re-shell/issues/172
  useEffect(() => {
    appRegistrations
      // Locale compare sort fix borrowed from: https://dev.to/charlesmwray/comment/l899
      .sort((a, b) => {
        return a.getTitle().localeCompare(
          b.getTitle(),
          // TODO: Replace hardcoding with dynamic variable
          "en",
          { sensitivity: "base" }
        );
      });
  }, [appRegistrations]);

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
