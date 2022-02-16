import { useMemo } from "react";
// import LED from "@components/LED";

import useAppOrchestrationContext from "@hooks/useAppOrchestrationContext";
import useDesktopContext from "@hooks/useDesktopContext";

// TODO: Incorporate this logic
// "The user can also click an app’s Dock icon to bring all of that app’s windows forward; the most recently accessed app window becomes the key window."
// (Ref. "Activating Windows": https://developer.apple.com/design/human-interface-guidelines/macos/windows-and-views/window-anatomy/)

// TODO: Scroll dock when scrolling mouse wheel

// TODO: Document
export default function Dock() {
  const { activeWindowController } = useDesktopContext();
  const { appRegistrations, activeAppRegistrations, activateAppRegistration } =
    useAppOrchestrationContext();

  // TODO: Import type definition
  /** @type {AppRegistration[]} */
  const dockRegistrations = useMemo(
    () => [
      ...new Set([
        ...appRegistrations.filter(registration =>
          registration.getIsPinnedToDock()
        ),
        ...activeAppRegistrations,
      ]),
    ],
    [appRegistrations, activeAppRegistrations]
  );

  // TODO: Import type definition
  /** @type {AppRegistration | void} */
  const activeRegistration = useMemo(
    () => activeWindowController?.getAppRegistration(),
    [activeWindowController]
  );

  return (
    <div
      // TODO: Move to module.css
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        textAlign: "center",
        isolation: "isolate",
        // TODO: Handle different?
        zIndex: 99999999,
        overflowX: "auto",
        pointerEvents: "none",
      }}
    >
      {
        // TODO: Add tooltip functionality
        // - https://www.npmjs.com/package/rc-tooltip
        // - https://www.npmjs.com/package/react-tooltip
        // - Note: Original Shell's Antd theme used rc-tooltip as the base (https://github.com/zenOSmosis/js-shell/blob/master/frontend/src/components/Desktop/Dock/DockItem.jsx)
        //
        // TODO: Add button menu
        // - See original Shell implementation: https://github.com/zenOSmosis/js-shell/blob/master/frontend/src/components/Desktop/Dock/DockItem.jsx
      }
      <div
        style={{
          display: "inline-block",
          color: "black",
          whiteSpace: "nowrap",
          maxWidth: "100%",
          pointerEvents: "all",
        }}
        className="button-group"
      >
        {dockRegistrations.map(registration => (
          <button
            style={Object.assign(
              registration === activeRegistration
                ? {
                    // TODO: Make this color a variable for highlighted elements
                    backgroundColor: "#347FE8",
                    color: "#000",
                  }
                : { backgroundColor: "#000" },
              { minWidth: 120 }
            )}
            key={registration.getUUID()}
            onClick={() => activateAppRegistration(registration)}
          >
            {registration.getTitle()} {/* <LED color="gray" /> */}
          </button>
        ))}
      </div>
    </div>
  );
}
