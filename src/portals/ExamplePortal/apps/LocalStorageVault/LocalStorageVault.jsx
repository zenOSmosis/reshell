// TODO: Implement encrypted storage (indexeddb usage as well?)
// TODO: Implement service for setting and retrieving local storage data
// TODO: Implement ability to see how much storage is used

// TODO: Use for local user profiles
// TODO: Use for optional backend for notes, etc. (anything which can save a file of a reasonably small size)

// TODO: Implement ability to export / import local storage data

import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";

// TODO: Include ReShell documentation here, as well as architecture overview

// TODO: Include in documentation how React providers can be wrapped up in (or
// as) services and dynamically included in the React tree

const LocalStorageVault = {
  id: "local-storage-vault",
  title: "Local Storage Vault",
  style: {
    right: 0,
    top: 0,
    width: 640,
    height: 480,
  },
  view: function View() {
    return (
      <Layout>
        <Content>
          <Center>[TODO: Implement LocalStorageVault]</Center>
        </Content>
        <Footer>
          <button>Empty</button>
        </Footer>
      </Layout>
    );
  },
};

export default LocalStorageVault;
