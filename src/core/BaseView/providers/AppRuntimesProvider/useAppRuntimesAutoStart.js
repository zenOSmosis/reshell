import { useEffect, useRef } from "react";

// TODO: Document
export default function useAppRuntimesAutoStart({
  appRegistrations,
  startAppRuntime,
}) {
  const refHasAutoStarted = useRef(false);

  // Automatically start registrations with isAutoStart set to true
  useEffect(() => {
    if (appRegistrations.length && !refHasAutoStarted.current) {
      for (const registration of appRegistrations) {
        if (registration.getIsAutoStart()) {
          startAppRuntime(registration);
        }
      }

      refHasAutoStarted.current = true;
    }
  }, [appRegistrations, startAppRuntime]);
}
