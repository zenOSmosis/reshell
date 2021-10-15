// TODO: Implement encrypted storage (indexeddb usage as well?)
// TODO: Implement service for setting and retrieving local storage data
// TODO: Implement ability to see how much storage is used

// TODO: Use for local user profiles
// TODO: Use for optional backend for notes, etc. (anything which can save a file of a reasonably small size)

// TODO: Implement ability to export / import local storage data

import { useCallback, useEffect, useState } from "react";

import Padding from "@components/Padding";
import Layout, { Header, Content, Footer } from "@components/Layout";
import LocalStorageItems from "./views/LocalStorageItems";
import NewKeyCreationForm from "./views/NewKeyCreationForm";

import BackArrowIcon from "@icons/BackArrowIcon";

import KeyVaultService from "@services/KeyVaultService";

const KeyVault = {
  id: "local-storage-vault",
  title: "Key Vault",
  style: {
    width: 640,
    height: 480,
  },
  serviceClasses: [KeyVaultService],
  view: function View({ appServices }) {
    const localDataPersistenceService = appServices[KeyVaultService];

    const [keyStorageEngineMaps, setKeyStorageEngineMaps] = useState([]);

    const handleFetchKeyStorageEngineMaps = useCallback(async () => {
      const keyMaps =
        await localDataPersistenceService.fetchKeyStorageEngineMaps();

      const keyStorageEngineMaps = [];

      for (const keyMap of keyMaps) {
        const key = keyMap[0];
        const storageEngine = keyMap[1];
        const value = await storageEngine.fetchItem(key);

        // TODO: Move this detection into the service (consider automatically
        // coercing primitive types:
        // @see https://developer.mozilla.org/en-US/docs/Glossary/Primitive
        const kind = typeof value;

        keyStorageEngineMaps.push({
          key,
          storageEngine,
          value,
          kind,
        });
      }

      setKeyStorageEngineMaps(keyStorageEngineMaps);
    }, [localDataPersistenceService]);

    const [isCreatingNewKey, setIsCreatingNewKey] = useState(false);

    // Auto-fetch
    useEffect(() => {
      handleFetchKeyStorageEngineMaps();
    }, [handleFetchKeyStorageEngineMaps]);

    const handleGetValue = useCallback(async (key, storageEngine) => {
      const value = await storageEngine.fetchItem(key);

      // TODO: Implement

      // TODO: Remove
      console.log({ key, value });

      // TODO: Remove
      alert("TODO: Implement get value");
    }, []);

    // TODO: Document
    const handleKeyValueSubmit = useCallback(
      formValues => {
        const storageEngine =
          localDataPersistenceService.getStorageEngineWithShortUUID(
            formValues["storageEngineShortUUID"]
          );

        storageEngine
          .setItem(formValues["key"], formValues["value"])
          .then(() => {
            handleFetchKeyStorageEngineMaps();

            setIsCreatingNewKey(false);
          });
      },
      [localDataPersistenceService, handleFetchKeyStorageEngineMaps]
    );

    // TODO: Document
    const handleEmpty = useCallback(() => {
      localDataPersistenceService
        .clearAllStorageEngines()
        .then(handleFetchKeyStorageEngineMaps);
    }, [localDataPersistenceService, handleFetchKeyStorageEngineMaps]);

    return (
      <Layout>
        <Header>
          <Padding>
            {/*
              <button>Session Storage</button>
            <button>IndexedDB</button>
            <button>Key Vault</button>
            <button>Memory</button>
              */}
            <button onClick={() => setIsCreatingNewKey(prev => !prev)}>
              {!isCreatingNewKey ? (
                <>(+) New Item</>
              ) : (
                <>
                  <BackArrowIcon /> Back
                </>
              )}
            </button>
          </Padding>
        </Header>
        <Content>
          <Padding>
            {!isCreatingNewKey ? (
              <LocalStorageItems
                keyStorageEngineMaps={keyStorageEngineMaps}
                onGetValue={handleGetValue}
              />
            ) : (
              <NewKeyCreationForm
                storageEngines={localDataPersistenceService.getStorageEngines()}
                onSubmit={handleKeyValueSubmit}
              />
            )}
          </Padding>
        </Content>
        <Footer>
          <Padding>
            <button onClick={handleEmpty}>Empty</button>
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default KeyVault;
