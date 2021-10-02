import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";

import ReShellCore from "@core";

// TODO: Include ReShell documentation here, as well as architecture overview

// TODO: Include in documentation how React providers can be wrapped up in (or
// as) services and dynamically included in the React tree

// TODO: Define portals in base index.js
// TODO: Read portals in (include some icon / description representing the individual portals)
// TODO: Implement ability to switch portals during runtime (include some lightweight graphical animation effect when switching)

const PortalSwitcher = {
  id: "portal-switcher",
  title: "Portal Switcher",
  style: {
    width: 640,
    height: 480,
  },
  view: function View() {
    return (
      <Layout>
        <Content>
          <Center>
            {Object.entries(ReShellCore.getPortals()).map(([portalName]) => (
              <button
                key={portalName}
                onClick={() => ReShellCore.init(portalName)}
              >
                {portalName}
              </button>
            ))}
          </Center>
        </Content>
        <Footer>[Footer]</Footer>
      </Layout>
    );
  },
};

export default PortalSwitcher;
