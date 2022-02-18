import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import Padding from "@components/Padding";

export default function LocalStorageItems({
  keyStorageEngineMaps = [],
  onGetValue,
  onEmpty,
  onNewItem,
}) {
  if (!keyStorageEngineMaps.length) {
    return (
      <Center>
        <Padding>
          <Padding style={{ fontWeight: "bold" }}>No Key Vault items.</Padding>
          <Padding className="note">
            These may be automatically managed by other applications as needed,
            in order to perform key / value pair storage operations.
          </Padding>
          <Padding className="note">
            You have the ability to clear all local / session storage via this
            utility.
          </Padding>
          <Padding>
            <button onClick={onNewItem}>Add new item...</button>
          </Padding>
        </Padding>
      </Center>
    );
  }

  return (
    <Layout>
      <Content>
        <Padding style={{ overflowY: "auto" }}>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <td></td>
                <td>Key</td>
                <td>Value</td>
                {/*
                    <td>Kind</td>
                    */}
                <td>Encryption</td>
                <td>Storage Engine</td>
              </tr>
            </thead>
            <tbody>
              {keyStorageEngineMaps.map((keyMap, idx) => {
                const { key, /* kind, */ storageEngine } = keyMap;

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
                    {/*
                        <td className="center">{kind}</td>
                        */}

                    <td className="center">
                      {storageEngine.getEncryptionType() || "Not Encrypted"}
                    </td>
                    <td className="center">{storageEngine.getTitle()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Padding>
      </Content>
      <Footer>
        <Padding>
          <button onClick={onEmpty}>Empty</button>
        </Padding>
      </Footer>
    </Layout>
  );
}
