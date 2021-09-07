import WindowManager from "../WindowManager";
import Full from "../Full";
import Layout, { Header, Content, Footer } from "../Layout";
import LED from "../LED";

// TODO: Change this to use Menubar
import Menu, { MenuButton, MenuItem, SubMenu } from "../_Menu.LibWrapper";

import useDesktopContext from "@hooks/useDesktopContext";
import useServicesContext from "@hooks/useServicesContext";
import useAppRegistrationsContext from "@hooks/useAppRegistrationsContext";
import useAppRuntimesContext from "@hooks/useAppRuntimesContext";

// TODO: Implement top menu-bar
// @see https://headlessui.dev/react/menu
// or (better?) https://szhsin.github.io/react-menu

// TODO: Implement context menu
// @see https://szhsin.github.io/react-menu/#context-menu

// TODO: Backgrounds?
// @see https://coolbackgrounds.io/

// TODO: Use prop-types
export default function Desktop({ appDescriptors }) {
  const { services } = useServicesContext();
  const { activeWindowController } = useDesktopContext();
  const { appRegistrations } = useAppRegistrationsContext();
  const { startAppRuntime } = useAppRuntimesContext();

  return (
    // NOTE: Typically this would take up the entire viewport
    <Full>
      <Layout>
        <Header
          style={{ borderBottom: "1px #ccc solid", whiteSpace: "nowrap" }}
        >
          <div style={{ float: "left" }}>
            {
              // TODO: If menu is open and user scrolls across menubar, open the
              // relevant scrolled-over menu
              // TODO: Refactor into menubar utility w/ similar API as Electron,
              // where the React components aren't utilized directly by the
              // implementors
            }
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
                  .map((app) => (
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
                .filter((app) => app.getIsPinned())
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
                .map((app) => (
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
                onClick={() => alert("TODO: Implement ReShell destruct")}
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
                  <MenuItem onClick={() => activeWindowController.destroy()}>
                    Close
                  </MenuItem>
                </Menu>
                <Menu
                  portal={true}
                  menuButton={<MenuButton>Window</MenuButton>}
                >
                  <MenuItem
                    onClick={() => activeWindowController.setIsMinimized(true)}
                  >
                    Minimize
                  </MenuItem>
                  <MenuItem
                    onClick={() => activeWindowController.setIsMaximized(true)}
                  >
                    Maximize
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>
          <div style={{ float: "right" }}>
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
                services.map((service) => (
                  <MenuItem
                    key={service.getUUID()}
                    onClick={() => alert("TODO: Implement")}
                  >
                    {service.getTitle()}
                  </MenuItem>
                ))
              )}
              {}
              {/*
              <MenuItem onClick={() => alert("TODO: Implement")}>
                Socket.io Service (mock)
              </MenuItem>
              <MenuItem onClick={() => alert("TODO: Implement")}>
                SocketAPI Service (mock)
              </MenuItem>
              <MenuItem onClick={() => alert("TODO: Implement")}>
                Host Bridge Service (mock)
              </MenuItem>
                */}
            </Menu>
          </div>
        </Header>
        <Content style={{ backgroundColor: "#ccc" }}>
          <div>TODO: Allow videos to play on background</div>

          {
            // TODO: Refactor into a version component
          }
          <div
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              color: "#fff",
              fontSize: "2rem",
            }}
          >
            {
              // TODO: Read from package.json
            }
            ReShell 0.0.1-alpha
          </div>
          <WindowManager appDescriptors={appDescriptors} />
        </Content>
        <Footer style={{ borderTop: "1px #ccc solid" }}>
          <div style={{ float: "right" }}>
            {
              // TODO: Include app locations in app descriptors to help organize applications in menus
              // TODO: Include LED to show state of application (i.e. "green" for "open" / "gray" for "close")
            }
            <Menu portal={true} menuButton={<MenuButton>Menu</MenuButton>}>
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
                .map((app) => (
                  <MenuItem
                    key={app.getUUID()}
                    onClick={() => startAppRuntime(app)}
                  >
                    {app.getTitle()}
                  </MenuItem>
                ))}
            </Menu>
          </div>
        </Footer>
      </Layout>
    </Full>
  );
}
