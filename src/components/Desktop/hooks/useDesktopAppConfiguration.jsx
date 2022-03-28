import React, { useEffect } from "react";

import useAppOrchestrationContext from "@hooks/useAppOrchestrationContext";
import useServiceClass from "@hooks/useServiceClass";

import AppAutoStartService from "@services/AppAutoStartService";

export const DesktopConfigurationContext = React.createContext({});

/**
 * @typedef {Object} UseDesktopAppConfigurationParams
 * @property {AppDescriptor[]} appDescriptors
 * @property {Object[]} TODO: Document
 */

/**
 * Configures the ReShell Desktop to use the given app descriptors and app
 * auto-start configs.
 *
 * @param {UseDesktopAppConfigurationParams}
 * @return {void}
 */
export default function useDesktopAppConfiguration({
  appDescriptors = [],
  defaultAppAutoStartConfigs = {},
}) {
  const { addOrUpdateAppRegistration } = useAppOrchestrationContext();

  // Automatically registers the given appDescriptors
  useEffect(() => {
    appDescriptors.forEach(descriptor =>
      addOrUpdateAppRegistration(descriptor)
    );
  }, [appDescriptors, addOrUpdateAppRegistration]);

  const { serviceInstance: appAutoStartService } = useServiceClass(
    AppAutoStartService,
    false
  );

  // Automatically registers the given defaultAppAutoStartConfigs
  useEffect(() => {
    appAutoStartService.setDefaultAppAutoStartConfigs(
      defaultAppAutoStartConfigs
    );
  }, [appAutoStartService, defaultAppAutoStartConfigs]);
}
