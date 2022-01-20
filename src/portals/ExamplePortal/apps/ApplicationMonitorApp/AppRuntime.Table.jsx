import AppRuntimeTableRow from "./AppRuntime.Table.Row";

// TODO: Document
export default function AppRuntimeTable({ appRuntimes }) {
  return (
    <table style={{ width: "100%" }}>
      <thead>
        <tr>
          <td rowSpan="2">Name</td>
          <td colSpan="6" style={{ backgroundColor: "purple" }}>
            Profiler
          </td>
          <td colSpan="2"></td>
        </tr>
        <tr>
          <td style={{ backgroundColor: "purple" }}>Phase</td>
          <td style={{ backgroundColor: "purple" }}>
            Actual
            <br />
            Duration
          </td>
          <td style={{ backgroundColor: "purple" }}>
            Base
            <br />
            Duration
          </td>
          <td style={{ backgroundColor: "purple" }}>
            Start
            <br />
            Time
          </td>
          <td style={{ backgroundColor: "purple" }}>
            Commit
            <br />
            Time
          </td>
          <td style={{ backgroundColor: "purple" }}>Interactions</td>
        </tr>
      </thead>
      <tbody>
        {appRuntimes.map((runtime) => (
          <AppRuntimeTableRow key={runtime.getUUID()} appRuntime={runtime} />
        ))}
      </tbody>
    </table>
  );
}
