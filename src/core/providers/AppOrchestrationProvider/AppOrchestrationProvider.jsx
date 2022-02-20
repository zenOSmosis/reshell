import React from "react";

import useServiceClass from "@hooks/useServiceClass";

import AppOrchestrationService from "@services/AppOrchestrationService";

import useAppRuntimesAutoStart from "./useAppRuntimesAutoStart";

export const AppOrchestrationContext = React.createContext({});

/**
 * Provides the React application with ReShell app orchestration servicing.
 */
export default function AppOrchestrationProvider({ children }) {
  const { serviceInstance: appOrchestrationService } = useServiceClass(
    AppOrchestrationService
  );

  const activeAppRegistrations =
    appOrchestrationService.getActiveAppRegistrations();
  const appRegistrations = appOrchestrationService.getAppRegistrations();
  const appRuntimes = appOrchestrationService.getAppRuntimes();
  /*
  const windowControllers = appRuntimes
    .map(runtime => runtime.getWindowController())
    // Don't include runtimes without window controllers
    .filter(pred => pred);
  */

  const activateAppRegistration =
    appOrchestrationService.activateAppRegistration;
  const activateAppRegistrationID =
    appOrchestrationService.activateAppRegistrationID;
  const addOrUpdateAppRegistration =
    appOrchestrationService.addOrUpdateAppRegistration;
  const getAppRegistrationTitleWithDescriptorID =
    appOrchestrationService.getAppRegistrationTitleWithDescriptorID;
  const getAppRuntimesWithRegistrationID =
    appOrchestrationService.getAppRuntimesWithRegistrationID;

  // Handles auto-start of apps which are set to automatically launch
  //
  // FIXME: (jh) Refactor using a different approach
  useAppRuntimesAutoStart(appRegistrations, activateAppRegistration);

  return (
    <AppOrchestrationContext.Provider
      value={{
        activeAppRegistrations,
        appRegistrations,
        appRuntimes,
        // windowControllers,
        //
        activateAppRegistration,
        activateAppRegistrationID,
        addOrUpdateAppRegistration,
        getAppRegistrationTitleWithDescriptorID,
        getAppRuntimesWithRegistrationID,
      }}
    >
      {children}
    </AppOrchestrationContext.Provider>
  );
}
