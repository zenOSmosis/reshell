import { consume } from "phantom-core";
import { useEffect, useState } from "react";
import Timer from "@components/Timer";
import { EVT_RENDER_PROFILE } from "@components/Window/classes/WindowController";
import LED from "@components/LED";

import useDesktopContext from "@hooks/useDesktopContext";

export default function AppRuntimeTableRow({ appRuntime }) {
  const { activeWindowController } = useDesktopContext();

  const windowController = appRuntime.getWindowController();

  const isTopMostWindowController =
    !windowController || windowController === activeWindowController;

  const [elProfilerPhase, setElProfilerPhase] = useState(null);
  const [elProfilerActualDuration, setElProfilerActualDuration] =
    useState(null);
  const [elProfilerBaseDuration, setElProfilerBaseDuration] = useState(null);
  const [elProfilerStartTime, setElProfilerStartTime] = useState(null);
  const [elProfilerCommitTime, setElProfilerCommitTime] = useState(null);
  const [elProfilerInteractions, setElProfilerInteractions] = useState(null);

  useEffect(() => {
    if (windowController && elProfilerPhase) {
      // @see https://reactjs.org/docs/profiler.html
      const handleRenderProfile = arrRenderProfile => {
        // IMPORTANT: (jh) This was not cast to an Object because I'm not
        // positive if that would induce a lot of extra overhead over time;
        // React defines this as an array, so maybe it's best just leaving it
        // the way it is
        const [
          id, // the "id" prop of the Profiler tree that has just committed
          phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
          actualDuration, // time spent rendering the committed update
          baseDuration, // estimated time to render the entire subtree without memoization
          startTime, // when React began rendering this update
          commitTime, // when React committed this update
          interactions, // the Set of interactions belonging to this update
        ] = arrRenderProfile;

        // We're not doing anything w/ id, but if we remove it from the array,
        // the other variable names are out of sync
        consume(id);

        // We have to skip setting these as state or we'll run into an infinite loop
        elProfilerPhase.innerHTML = phase;
        elProfilerActualDuration.innerHTML =
          parseFloat(actualDuration).toFixed(2);
        elProfilerBaseDuration.innerHTML = parseFloat(baseDuration).toFixed(2);
        elProfilerStartTime.innerHTML = parseFloat(startTime / 1000).toFixed(2);
        elProfilerCommitTime.innerHTML = parseFloat(commitTime / 1000).toFixed(
          2
        );
        elProfilerInteractions.innerHTML = Object.values(interactions).length;
      };

      windowController.on(EVT_RENDER_PROFILE, handleRenderProfile);

      return function unmount() {
        windowController.off(EVT_RENDER_PROFILE, handleRenderProfile);
      };
    }
  }, [
    windowController,
    elProfilerPhase,
    elProfilerActualDuration,
    elProfilerBaseDuration,
    elProfilerStartTime,
    elProfilerCommitTime,
    elProfilerInteractions,
  ]);

  return (
    <>
      <tr key={appRuntime.getUUID()} style={{ textAlign: "center" }}>
        <td>{appRuntime.getTitle() || "[Untitled]"}</td>
        <td style={{ backgroundColor: "purple" }}>
          <span ref={setElProfilerPhase}>N/A</span>
        </td>
        <td style={{ backgroundColor: "purple" }}>
          <span ref={setElProfilerActualDuration}>N/A</span>
        </td>
        <td style={{ backgroundColor: "purple" }}>
          <span ref={setElProfilerBaseDuration}>N/A</span>
        </td>
        <td style={{ backgroundColor: "purple" }}>
          <span ref={setElProfilerStartTime}>N/A</span>
        </td>
        <td style={{ backgroundColor: "purple" }}>
          <span ref={setElProfilerCommitTime}>N/A</span>
        </td>
        <td style={{ backgroundColor: "purple" }}>
          <span ref={setElProfilerInteractions}>N/A</span>
        </td>
      </tr>
      <tr style={{ textAlign: "center" }}>
        <td style={{ fontStyle: "italic" }}>
          Uptime: <Timer onTick={() => appRuntime.getInstanceUptime()} />
        </td>
        <td colSpan="3">
          <button
            // TODO: Implement alternate handling
            onClick={() => console.log({ appRuntime })}
            disabled
          >
            Process
          </button>
          <span> | </span>
          <button
            // TODO: Implement alternate handling
            onClick={() =>
              console.log({ environment: appRuntime.getEnvironment() })
            }
            disabled
          >
            Environment
          </button>
        </td>
        <td>
          <LED color={isTopMostWindowController ? "green" : "gray"} />
        </td>
        <td colSpan="2">
          <button
            onClick={() => windowController.bringToTop()}
            style={{ backgroundColor: "blue" }}
            disabled={isTopMostWindowController}
          >
            Bring to Top
          </button>
          <span> | </span>
          <button
            onClick={() => {
              if (!appRuntime.getHasDestroyStarted()) {
                appRuntime.destroy();
              }
            }}
            style={{ backgroundColor: "red" }}
          >
            Close
          </button>
        </td>
      </tr>
      <tr>
        <td colSpan="7" style={{ backgroundColor: "gray", height: 4 }}></td>
      </tr>
    </>
  );
}
