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

  // Automatically start registrations with isAutoStart set to true
  useEffect(() => {
    if (appRegistrations.length && !refHasBegunAutoStart.current) {
      // Prevent auto-start sequence from happening more than once
      refHasBegunAutoStart.current = true;

      for (const registration of [...appRegistrations].filter(registration =>
        registration.getIsAutoStart()
      )) {
        activateAppRegistration(registration);
      }

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
