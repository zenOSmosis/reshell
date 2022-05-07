import { useCallback, useState } from "react";
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

// import StartScreen from "./Desktop.StartScreen";

import useDesktopAppConfiguration from "./hooks/useDesktopAppConfiguration";

// TODO: Consider using Noto Sans font for UI (same that Slack uses, nice font;
// preload resources w/ Preloader component): https://fonts.google.com/noto/specimen/Noto+Sans

// TODO: Implement context menu
// @see https://szhsin.github.io/react-menu/#context-menu

// TODO: Use prop-types
// TODO: Document
export default function Desktop({
  backgroundView = null,
  appDescriptors,
  defaultAppAutoStartConfigs,
}) {
  useDesktopAppConfiguration({
    appDescriptors,
    defaultAppAutoStartConfigs,
  });

  /*
  const [isShowingStartScreen, setIsShowingStartScreen] = useState(true);

  const handleStartScreenExit = useCallback(() => {
    setIsShowingStartScreen(false);
  }, []);
  */

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

                    // The following properties enable this to overlay all (or
                    // most) other components without interfering with their
                    // handling (thanks to "pointer-events: none")
                    pointerEvents: "none",
                  }}
                >
                  <AutoScaler style={{ whiteSpace: "nowrap" }}>
                    <div style={{ textAlign: "left", fontSize: ".5em" }}>
                      {
                        // TODO: Load as env variable
                      }
                      <div>ReShell {ReShellCore.getReShellVersion()}</div>
                      <div>
                        PhantomCore {PhantomCore.getPhantomCoreVersion()}
                      </div>
                      {
                        // FIXME: (jh) This typically always renders "default"
                        // for the portal name, and portal name acquisition
                        // needs to be improved (more than likely via
                        // reshell-scripts and __registerPortals__.js)
                        /*
                        <div>Portal: {ReShellCore.getPortalName()}</div>
                        */
                      }
                      <div>Env: {process.env.NODE_ENV}</div>
                    </div>
                  </AutoScaler>
                </div>
                <WindowManager>
                  <Dock />
                </WindowManager>
              </Content>
            </Layout>
          </Cover>
        </NotificationProvider>
      </ModalProvider>

      {/*
      isShowingStartScreen && (
        <Cover>
          <StartScreen onExit={handleStartScreenExit} />
        </Cover>
      )
      */}
    </FullViewport>
  );
}
