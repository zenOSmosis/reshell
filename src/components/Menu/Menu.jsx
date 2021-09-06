import LibMenu, { MenuItem, MenuButton, SubMenu } from "../_Menu.LibWrapper";

// @see https://www.electronjs.org/docs/api/menu#examples

export default function Menu({ menuData }) {
  // TODO: Remove
  console.log({ menuData });
  //return null;

  return (
    <div>
      <LibMenu
        portal={true}
        menuButton={
          <MenuButton>
            {
              // TODO: Make this string configurable
            }
            {menuData.label || menuData.role}
          </MenuButton>
        }
      >
        {menuData.submenu.map((subMenuData, idx) => {
          const label =
            subMenuData.label || (subMenuData.role && subMenuData.role);

          if (label) {
            return (
              <MenuItem key={idx} onClick={subMenuData.click}>
                {
                  // TODO: If showing role, ensure it is normalized (role is lower-cased)
                }
                {label}
              </MenuItem>
            );
          }
        })}

        {
          // TODO: Implement support for recursive flyouts
        }
      </LibMenu>
    </div>
  );
}
