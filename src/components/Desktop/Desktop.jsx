import WindowManager from "../WindowManager";
import Cover from "../Cover";
import Layout, { Header, Content, Row, Column } from "../Layout";
import LED from "../LED";
import Dock from "../Dock";
import AutoScaler from "../AutoScaler";

import { BrowserRouter as Router } from "react-router-dom";

// TODO: Change this to use data-driven Menubar
import Menu, { MenuButton, MenuItem, SubMenu } from "../_Menu.LibWrapper";

import useDesktopContext from "@hooks/useDesktopContext";
import useServicesContext from "@hooks/useServicesContext";
import useAppRegistrationsContext from "@hooks/useAppRegistrationsContext";
import useAppRuntimesContext from "@hooks/useAppRuntimesContext";
import NotificationsProvider from "./providers/NotificationsProvider";

// import { useEffect } from "react";

// TODO: Implement top menu-bar
// @see https://headlessui.dev/react/menu
// or (better?) https://szhsin.github.io/react-menu

// TODO: Implement context menu
// @see https://szhsin.github.io/react-menu/#context-menu

// TODO: Backgrounds?
// @see https://coolbackgrounds.io (particles: https://github.com/marcbruederlin/particles.js)

// TODO: Use prop-types
export default function Desktop({
  backgroundView = <div style={{ backgroundColor: "#ccc" }} />,
  appDescriptors,
}) {
  const { services } = useServicesContext();
  const { activeWindowController /* addBackgroundAsset */ } =
    useDesktopContext();
  const { appRegistrations } = useAppRegistrationsContext();
  const { startAppRuntime } = useAppRuntimesContext();

  // TODO: Implement after PhantomWrapper (or equiv.; assets need to be wrapped in
  // PhantomCore instances in order to be added to background collection)
  /*
  useEffect(() => {
    if (backgroundView) {
      addBackgroundAsset(backgroundView);
    }
  }, [backgroundView, addBackgroundAsset]);
  */

  return (
    // NOTE: Typically this would take up the entire viewport
    <Router>
      {
        // IMPORTANT: Using NotificationsProvider directly on the BaseView does
        // not apply CSS module styling
      }
      <NotificationsProvider>
        <Cover>
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
              <Row>
                <Column style={{ width: "100%" }}>
                  {
                    // TODO: Replace menu with data-driven Menubar component
                  }
                  <div>
                    <Menu
                      portal={true}
                      menuButton={
                        <MenuButton>
                          {
                            // TODO: Make this string configurable
                          }
                          Desktop
                        </MenuButton>
                      }
                    >
                      {
                        // TODO: Show divider
                      }
                      <SubMenu label="Applications">
                        {appRegistrations
                          .sort((a, b) => {
                            const aTitle = a.getTitle();
                            const bTitle = b.getTitle();

                            if (aTitle < bTitle) {
                              return -1;
                            } else if (bTitle > aTitle) {
                              return 1;
                            } else {
                              return 0;
                            }
                          })
                          .map(app => (
                            <MenuItem
                              key={app.getUUID()}
                              onClick={() => startAppRuntime(app)}
                            >
                              {app.getTitle()}
                            </MenuItem>
                          ))}
                      </SubMenu>
                      {
                        // TODO: Show divider
                        // TODO: Include LED to show state of application (i.e. "green" for "open" / "gray" for "close")
                      }
                      {appRegistrations
                        .filter(app => app.getIsPinned())
                        .map(app => (
                          <MenuItem
                            key={app.getUUID()}
                            onClick={() => startAppRuntime(app)}
                          >
                            {app.getTitle()}
                          </MenuItem>
                        ))}
                      {
                        // TODO: Show divider
                      }
                      <MenuItem
                        onClick={() =>
                          alert(
                            "TODO: Implement window w/ overview of System Information"
                          )
                        }
                      >
                        About / System Information
                      </MenuItem>
                      {
                        // TODO: Show divider
                      }
                      <MenuItem
                        onClick={() =>
                          alert("TODO: Implement ReShell destruct")
                        }
                      >
                        Close
                      </MenuItem>
                      {
                        // TODO: Show divider
                      }
                      <MenuItem
                        onClick={() => {
                          // TODO: Only reload after ReShell destruct
                          window.location.reload();
                        }}
                      >
                        Reload
                      </MenuItem>
                    </Menu>
                    {activeWindowController && (
                      <>
                        {
                          // TODO: Implement quadrant snapping here
                        }
                        <Menu
                          portal={true}
                          menuButton={
                            <MenuButton>
                              <span style={{ fontWeight: "bold" }}>
                                {activeWindowController.getTitle()}
                              </span>
                            </MenuButton>
                          }
                        >
                          <MenuItem
                            onClick={() => activeWindowController.destroy()}
                          >
                            Close
                          </MenuItem>
                        </Menu>
                        <Menu
                          portal={true}
                          menuButton={<MenuButton>Window</MenuButton>}
                        >
                          <MenuItem
                            onClick={() =>
                              activeWindowController.setIsMinimized(true)
                            }
                          >
                            Minimize
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              activeWindowController.setIsMaximized(true)
                            }
                          >
                            Maximize
                          </MenuItem>
                          <MenuItem
                            onClick={() => activeWindowController.center()}
                          >
                            Center
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                  </div>
                </Column>
                <Column
                  style={{
                    // TODO: Rework so column width expands according to content
                    maxWidth: 100,
                  }}
                >
                  <div style={{ textAlign: "right" }}>
                    <Menu
                      portal={true}
                      menuButton={
                        <MenuButton>
                          Service Core{" "}
                          <LED color={services.length > 0 ? "green" : "gray"} />
                        </MenuButton>
                      }
                    >
                      {services.length === 0 ? (
                        <MenuItem>
                          <span style={{ fontStyle: "italic" }}>
                            No running services
                          </span>
                        </MenuItem>
                      ) : (
                        services.map(service => (
                          <MenuItem
                            key={service.getUUID()}
                            onClick={() => alert("TODO: Implement")}
                          >
                            {service.getTitle()}
                          </MenuItem>
                        ))
                      )}
                    </Menu>
                  </div>
                </Column>
              </Row>
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
                  maxWidth: "30%",
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  color: "#fff",
                  fontSize: "2rem",
                }}
              >
                {
                  // TODO: Read from package.json
                  // @see https://stackoverflow.com/questions/48609931/how-can-i-reference-package-version-in-npm-script/48619640
                  // (i.e. REACT_APP_VERSION=$npm_package_version)
                }
                <AutoScaler style={{ whiteSpace: "nowrap" }}>
                  ReShell 0.0.1-alpha
                </AutoScaler>
              </div>
              <WindowManager appDescriptors={appDescriptors}>
                <Dock />
              </WindowManager>
            </Content>
          </Layout>
        </Cover>
      </NotificationsProvider>
    </Router>
  );
}
