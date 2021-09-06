import LibMenu, { MenuItem, MenuButton, SubMenu } from "../_Menu.LibWrapper";

// @see https://www.electronjs.org/docs/api/menu#examples
// TODO: Make this data driven

export default function Menu() {
  // TODO: Remove these mocks
  const appRegistrations = [];
  const startAppRuntime = () => null;

  return (
    <div>
      <LibMenu
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
          {appRegistrations.map((app) => (
            <MenuItem key={app.getUUID()} onClick={() => startAppRuntime(app)}>
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
          .map((app) => (
            <MenuItem key={app.getUUID()} onClick={() => startAppRuntime(app)}>
              {app.getTitle()}
            </MenuItem>
          ))}
        {
          // TODO: Show divider
        }
        <MenuItem
          onClick={() =>
            alert("TODO: Implement window w/ overview of System Information")
          }
        >
          About / System Information
        </MenuItem>
        {
          // TODO: Show divider
        }
        <MenuItem onClick={() => alert("TODO: Implement ReShell destruct")}>
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
      </LibMenu>
    </div>
  );
}
