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
  view: function View() {
    const { appRuntimes } = useAppRuntimesContext();

    // TODO: Group by registration
    // TODO: Show attached services, per application
    // TODO: Show last render time / frequency / graph?
    // TODO: Highlight active window application
    // TODO: Implement ability to bring application to front

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
