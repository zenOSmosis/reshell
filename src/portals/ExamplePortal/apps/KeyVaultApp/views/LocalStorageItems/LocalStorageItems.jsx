import Full from "@components/Full";
import Layout, { Content, Footer } from "@components/Layout";
import StickyTable from "@components/StickyTable";
import Center from "@components/Center";
import Padding from "@components/Padding";

import useForceUpdate from "@hooks/useForceUpdate";

export default function LocalStorageItems({
  keyStorageEngineMaps = [],
  onGetValue,
  onEmpty,
  onNewItem,
}) {
  const forceUpdate = useForceUpdate();

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
        <Full style={{ overflowY: "auto" }}>
          <StickyTable>
            <thead>
              <tr>
                <td></td>
                <td>
                  <Padding>Key</Padding>
                </td>
                <td style={{ color: "gray" }}>
                  <Padding>Value</Padding>
                </td>
                {/*
                    <td>Kind</td>
                    */}
                <td>
                  <Padding>Encryption</Padding>
                </td>
                <td>
                  <Padding>Storage Engine</Padding>
                </td>
              </tr>
            </thead>
            <tbody>
              {keyStorageEngineMaps.map((keyMap, idx) => {
                const { key, /* kind, */ storageEngine } = keyMap;

                return (
                  <tr key={idx}>
                    <td className="center">
                      <Padding>
                        <input
                          type="checkbox"
                          // TODO: Remove hard-coding
                          disabled
                        ></input>
                      </Padding>
                    </td>
                    <td>
                      <Padding>{key}</Padding>
                    </td>
                    <td className="center">
                      <button
                        onClick={() => onGetValue(key, storageEngine)}
                        // TODO: Remove hard-coding
                        disabled
                      >
                        Get
                      </button>
                    </td>
                    {/*
                        <td className="center">{kind}</td>
                        */}

                    <td className="center">
                      <Padding>
                        {storageEngine.getEncryptionType() || "None"}
                      </Padding>
                    </td>
                    <td className="center">
                      <Padding>{storageEngine.getTitle()}</Padding>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </StickyTable>
        </Full>
      </Content>
      <Footer>
        <Padding style={{ overflow: "auto" }}>
          <button onClick={onEmpty}>Empty</button>

          <button style={{ float: "right" }} onClick={forceUpdate}>
            Reload
          </button>
        </Padding>
      </Footer>
    </Layout>
  );
}
