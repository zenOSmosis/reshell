// TODO: Implement encrypted storage (indexeddb usage as well?)
// TODO: Implement service for setting and retrieving local storage data
// TODO: Implement ability to see how much storage is used

// TODO: Use for local user profiles
// TODO: Use for optional backend for notes, etc. (anything which can save a file of a reasonably small size)

// TODO: Implement ability to export / import local storage data

import Padding from "@components/Padding";
import Layout, { Header, Content, Footer } from "@components/Layout";
import LocalStorageItems from "./views/LocalStorageItems";

import LocalDataPersistenceService from "@services/LocalDataPersistenceService";

// TODO: Include ReShell documentation here, as well as architecture overview

// TODO: Include in documentation how React providers can be wrapped up in (or
// as) services and dynamically included in the React tree

const LocalStorageVault = {
  id: "local-storage-vault",
  title: "Local Storage Vault",
  style: {
    width: 640,
    height: 480,
  },
  serviceClasses: [LocalDataPersistenceService],
  view: function View({ appServices }) {
    const localDataPersistenceService =
      appServices[LocalDataPersistenceService];

    // TODO: Remove
    localDataPersistenceService.fetchKeys().then(keys => console.log({ keys }));

    return (
      <Layout>
        <Header>
          <Padding>
            {/*
              <button>Session Storage</button>
            <button>IndexedDB</button>
            <button>Local Storage</button>
            <button>Memory</button>
              */}
            <button>(+) New Item</button>
          </Padding>
        </Header>
        <Content>
          <Padding>
            <LocalStorageItems />
          </Padding>
        </Content>
        <Footer>
          <Padding>
            <button>Empty</button>
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default LocalStorageVault;
