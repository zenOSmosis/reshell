import Timer from "@components/Timer";
import useAppRuntimesContext from "@hooks/useAppRuntimesContext";

const ApplicationMonitor = {
  id: "application-monitor",
  title: "Application Monitor",
  style: {
    left: "auto",
    bottom: 0,
    width: 640,
    height: 480,
  },
  isPinned: true,
  view: function View({ appRuntime }) {
    const { appRuntimes } = useAppRuntimesContext();

    // TODO: Add process uptime timer

    return (
      <table style={{ width: "100%" }}>
        <tbody>
          {appRuntimes.map((runtime) => (
            <tr key={runtime.getUUID()}>
              <td className="center">
                <input type="checkbox" />
              </td>
              <td>{runtime.getTitle() || "[Untitled]"}</td>
              <td className="center">
                <Timer onTick={() => runtime.getInstanceUptime()} />
              </td>
              <td>
                <button
                  onClick={() => runtime.destroy()}
                  style={{ width: "100%" }}
                  disabled={Object.is(appRuntime, runtime)}
                >
                  Close
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};

export default ApplicationMonitor;
