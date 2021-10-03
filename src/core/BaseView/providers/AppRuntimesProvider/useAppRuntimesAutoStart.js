import { useEffect, useRef } from "react";

// TODO: Document
export default function useAppRuntimesAutoStart({
  appRegistrations,
  startAppRuntime,
}) {
  const refHasAutoStarted = useRef(false);

  // Automatically start registrations with isAutoStart set to true
  useEffect(() => {
    // NOTE: This timeout fixes an issue where two or more registrations could
    // not open at once
    const openTimeout = setTimeout(() => {
      if (appRegistrations.length && !refHasAutoStarted.current) {
        // FIXME: (jh) The reversed registrations seems to open apps in forward
        // order, based on how they are defined in the desktop array.  I
        // haven't done a lot of testing against this, so this may need to be
        // redefined as necessary
        for (const registration of [...appRegistrations].reverse()) {
          if (registration.getIsAutoStart()) {
            startAppRuntime(registration);
          }
        }

        refHasAutoStarted.current = true;
      }
    });

    return function unmount() {
      clearTimeout(openTimeout);
    };
  }, [appRegistrations, startAppRuntime]);
}
