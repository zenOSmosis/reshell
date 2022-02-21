import PhantomCore from "phantom-core";
import ReShellCore from "@core";

import WindowManager from "./Desktop.WindowManager";
import TopBar from "./Desktop.TopBar";
import Dock from "./Desktop.Dock";

import FullViewport from "../FullViewport";
import Cover from "../Cover";
import Layout, { Header, Content } from "../Layout";

import AutoScaler from "../AutoScaler";

import NotificationProvider from "./providers/NotificationProvider";
import ModalProvider from "./providers/ModalProvider";

// TODO: Implement context menu
// @see https://szhsin.github.io/react-menu/#context-menu

// TODO: Use prop-types
// TODO: Document
export default function Desktop({ backgroundView = null, appDescriptors }) {
  return (
    <FullViewport>
      {
        // IMPORTANT: Using NotificationProvider directly on the BaseView does
        // not apply CSS module styling
      }
      <ModalProvider>
        <NotificationProvider>
          <Cover
            // TODO: Remove this hardcoding
            style={{
              backgroundColor: "#424242",
            }}
          >
            {
              // TODO: Refactor
            }
            {backgroundView}
          </Cover>
          <Cover>
            <Layout>
              <Header
                style={{
                  // borderBottom: "1px #ccc solid",
                  whiteSpace: "nowrap",
                  backgroundColor: "rgba(0,0,0,.5)",
                }}
              >
                <TopBar />
              </Header>
              <Content>
                {
                  // TODO: Allow videos to play on background
                }

                {
                  // TODO: Refactor into a version component
                }
                <div
                  style={{
                    maxWidth: "50%",
                    position: "absolute",
                    bottom: 28,
                    right: 10,
                    color: "rgba(255,255,255,.2)",
                    fontSize: "2rem",
                  }}
                >
                  {
                    // TODO: Read from package.json
                    // @see https://stackoverflow.com/questions/48609931/how-can-i-reference-package-version-in-npm-script/48619640
                    // (i.e. REACT_APP_VERSION=$npm_package_version)
                    //
                    // TODO: If wanting to overlay completely on top of all other windows, and ignore mouse, etc:
                    // use CSS [pointer-events: none]
                  }
                  <AutoScaler style={{ whiteSpace: "nowrap" }}>
                    <div style={{ textAlign: "left", fontSize: ".7em" }}>
                      {
                        // TODO: Load as env variable
                      }
                      <div>ReShell {ReShellCore.getReShellVersion()}</div>
                      <div>
                        PhantomCore {PhantomCore.getPhantomCoreVersion()}
                      </div>
                      <div>Portal: {ReShellCore.getPortalName()}</div>
                      <div>Env: {process.env.NODE_ENV}</div>
                    </div>
                  </AutoScaler>
                </div>
                <WindowManager appDescriptors={appDescriptors}>
                  <Dock />
                </WindowManager>
              </Content>
            </Layout>
          </Cover>
        </NotificationProvider>
      </ModalProvider>
    </FullViewport>
  );
}
