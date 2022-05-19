/**
 * View which renders while ReShell is tearing down.
 *
 * Note: This is in place in to serve as a fallback UI in case ReShell cannot reliably tear down its own.
 */
export default function TearDownView({ onForceReload }) {
  // Note: This component cannot reliably use the system @components without
  // side-effects which may impact the regular application.  Most notably the
  // Full / Center components might be affected in the regular ReShell DOM.
  return (
    <div style={{ margin: 10, textAlign: "center", fontWeight: "bold" }}>
      <div>
        The system is shutting down.
        <div style={{ marginTop: 40 }}>
          <button onClick={onForceReload}>Force Reload</button>
        </div>
      </div>
    </div>
  );
}
