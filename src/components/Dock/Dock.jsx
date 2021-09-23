import { useCallback, useMemo } from "react";
// import LED from "@components/LED";

import useAppRegistrationsContext from "@hooks/useAppRegistrationsContext";
import useAppRuntimesContext from "@hooks/useAppRuntimesContext";
import useDesktopContext from "@hooks/useDesktopContext";

export default function Dock() {
  const { activeWindowController } = useDesktopContext();
  const {
    appRuntimes,
    startAppRuntime,
    runningRegistrations,
    bringToFrontOrStartAppRuntime,
  } = useAppRuntimesContext();
  const { appRegistrations } = useAppRegistrationsContext();

  // TODO: Import type definition
  /** @type {AppRegistration[]} */
  const dockRegistrations = useMemo(
    () => [
      ...new Set([
        ...appRegistrations.filter(registration =>
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
        {dockRegistrations.map(registration => (
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
            onClick={() => bringToFrontOrStartAppRuntime(registration)}
          >
            {registration.getTitle()} {/* <LED color="gray" /> */}
          </button>
        ))}
      </div>
    </div>
  );
}
