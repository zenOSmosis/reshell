import { useEffect, useRef } from "react";

import useLocationAppRegistrationID from "@hooks/useLocationAppRegistrationID";
import useServiceClass from "@hooks/useServiceClass";

import AppAutoStartService from "@services/AppAutoStartService";

/**
 * Handles auto-start of apps which are set to automatically launch.
 *
 * @param {AppRegistration[]}
 * @param {func} activateAppRegistration
 * @return {void}
 */
export default function useAppRuntimesAutoStart(
  appRegistrations,
  activateAppRegistration
) {
  const refHasBegunAutoStart = useRef(false);

  const locationAppRegistrationID = useLocationAppRegistrationID();

  const { serviceInstance: appAutoStartService } = useServiceClass(
    AppAutoStartService,
    false
  );

  // Automatically start
  //
  // TODO: Move this functionality to AppAutoStartService
  useEffect(() => {
    if (appRegistrations.length && !refHasBegunAutoStart.current) {
      refHasBegunAutoStart.current = true;

      const prioritizedAutoStartAppRegistrations =
        appAutoStartService.getPrioritizedAppAutoStartRegistrations();
      for (const registration of prioritizedAutoStartAppRegistrations) {
        activateAppRegistration(registration);
      }

      // IMPORTANT: The queueMicrotask call fixes an issue where deep-linked apps
      // would not focus
      queueMicrotask(() => {
        if (locationAppRegistrationID) {
          const locationAppRegistration = appRegistrations.find(
            registration => registration.getID() === locationAppRegistrationID
          );

          if (locationAppRegistration) {
            activateAppRegistration(locationAppRegistration);
          }
        }
      });
    }
  }, [
    locationAppRegistrationID,
    appRegistrations,
    activateAppRegistration,
    appAutoStartService,
  ]);
}
