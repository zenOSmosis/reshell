import { useEffect, useRef } from "react";
import useLocationAppRegistrationID from "@hooks/useLocationAppRegistrationID";

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

  // Automatically start
  //
  // TODO: Move this functionality to AppAutoStartService
  useEffect(() => {
    if (!refHasBegunAutoStart.current) {
      refHasBegunAutoStart.current = true;

      // IMPORTANT: The setImmediate call fixes an issue where deep-linked apps
      // would not focus
      setImmediate(() => {
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
  }, [locationAppRegistrationID, appRegistrations, activateAppRegistration]);
}
