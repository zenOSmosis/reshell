import { useEffect, useRef } from "react";

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

  // Automatically start registrations with isAutoStart set to true
  useEffect(() => {
    if (appRegistrations.length && !refHasBegunAutoStart.current) {
      // Prevent auto-start sequence from happening more than once
      refHasBegunAutoStart.current = true;

      // FIXME: (jh) The reversed registrations seems to open apps in forward
      // order, based on how they are defined in the desktop array.  I
      // haven't done a lot of testing against this, so this may need to be
      // redefined as necessary
      for (const registration of [...appRegistrations]
        .filter(registration => registration.getIsAutoStart())
        .reverse()) {
        activateAppRegistration(registration);
      }
    }
  }, [appRegistrations, activateAppRegistration]);
}
