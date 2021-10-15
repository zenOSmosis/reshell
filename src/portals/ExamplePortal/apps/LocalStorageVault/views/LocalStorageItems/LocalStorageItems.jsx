export default function LocalStorageItems({
  keyStorageEngineMaps = [],
  onGetValue,
}) {
  return (
    <table style={{ width: "100%" }}>
      <thead>
        <tr>
          <td></td>
          <td>Key</td>
          <td>Value</td>
          <td>Kind</td>
          <td>Encryption</td>
          <td>Storage Engine</td>
        </tr>
      </thead>
      <tbody>
        {keyStorageEngineMaps.map((keyMap, idx) => {
          const { key, kind, storageEngine } = keyMap;

          return (
            <tr key={idx}>
              <td className="center">
                <input type="checkbox"></input>
              </td>
              <td>{key}</td>
              <td className="center">
                <button onClick={() => onGetValue(key, storageEngine)}>
                  Get
                </button>
              </td>
              <td>{kind}</td>
              <td>Not Encrypted</td>
              <td>{storageEngine.getTitle()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
