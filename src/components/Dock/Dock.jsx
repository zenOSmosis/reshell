import { useCallback, useMemo } from "react";
// import LED from "@components/LED";

import useAppRegistrationsContext from "@hooks/useAppRegistrationsContext";
import useAppRuntimesContext from "@hooks/useAppRuntimesContext";
import useDesktopContext from "@hooks/useDesktopContext";

export default function Dock() {
  const { activeWindowController } = useDesktopContext();
  const { appRuntimes, startAppRuntime } = useAppRuntimesContext();
  const { appRegistrations } = useAppRegistrationsContext();

  // TODO: Import type definition
  /** @type {AppRegistration[]} */
  const runningRegistrations = useMemo(
    () => appRuntimes.map((runtime) => runtime.getRegistration()),
    [appRuntimes]
  );

  // TODO: Import type definition
  /** @type {AppRegistration[]} */
  const dockRegistrations = useMemo(
    () => [
      ...new Set([
        ...appRegistrations.filter((registration) =>
          registration.getIsPinnedToDock()
        ),
        ...runningRegistrations,
      ]),
    ],
    [appRegistrations, runningRegistrations]
  );

  // TODO: Import type definition
  /** @type {AppRegistration | void} */
  const activeRegistration = useMemo(
    () => activeWindowController?.getAppRegistration(),
    [activeWindowController]
  );

  // TODO: Refactor into window manager?
  const handleDockRegistrationClick = useCallback(
    (appRegistration) => {
      if (!runningRegistrations.includes(appRegistration)) {
        // TODO: Open app w/ registration
        startAppRuntime(appRegistration);
      } else {
        // Move grouped windows to top
        // TODO: Order by window manager stacking order (most recently used
        // window in group should appear in top)
        // TODO: Refactor into window manager?
        appRuntimes
          .filter((runtime) => runtime.getRegistration() === appRegistration)
          .forEach((runtime) => runtime.bringToTop());
      }
    },
    [runningRegistrations, startAppRuntime, appRuntimes]
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        textAlign: "center",
        isolation: "isolate",
        // TODO: Handle different?
        zIndex: 99999999,
      }}
    >
      <div style={{ display: "inline-block", color: "black" }}>
        {dockRegistrations.map((registration) => (
          <button
            style={
              registration === activeRegistration
                ? {
                    backgroundColor: "rgba(38, 157, 255, .8)",
                    color: "#000",
                  }
                : {}
            }
            key={registration.getUUID()}
            onClick={() => handleDockRegistrationClick(registration)}
          >
            {registration.getTitle()} {/* <LED color="gray" /> */}
          </button>
        ))}
      </div>
    </div>
  );
}
