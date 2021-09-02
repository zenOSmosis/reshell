import WindowManager from "../WindowManager";
import Full from "../Full";
import Layout, { Header, Content, Footer } from "../Layout";
import Menu, { MenuButton, MenuItem } from "../Menu";

import useDesktopContext from "../../hooks/useDesktopContext";

// TODO: Implement top menu-bar
// @see https://headlessui.dev/react/menu
// or (better?) https://szhsin.github.io/react-menu

// TODO: Implement context menu
// @see https://szhsin.github.io/react-menu/#context-menu

export default function Desktop({ initialWindows }) {
  const { activeWindowController } = useDesktopContext();

  return (
    // NOTE: Typically this would take up the entire viewport
    <Full>
      <Layout>
        <Header
          style={{ borderBottom: "1px #ccc solid", whiteSpace: "nowrap" }}
        >
          {
            // TODO: If menu is open and user scrolls across menubar, open the
            // relevant scrolled-over menu
            // TODO: Refactor into menubar utility w/ similar API as Electron,
            // where the React components aren't utilized directly by the
            // implementors
          }
          <Menu portal={true} menuButton={<MenuButton>Desktop</MenuButton>}>
            <MenuItem onClick={() => window.location.reload()}>Reload</MenuItem>
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
              <Menu portal={true} menuButton={<MenuButton>Window</MenuButton>}>
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
              // TODO: Make dynamic
            }
            ReShell 0.0.1-alpha
          </div>
          <WindowManager initialWindows={initialWindows} />
        </Content>
        <Footer style={{ borderTop: "1px #ccc solid" }}>
          <div style={{ float: "right" }}>
            <button>Menu</button>
          </div>
        </Footer>
      </Layout>
    </Full>
  );
}
