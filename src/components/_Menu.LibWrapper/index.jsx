// @see https://szhsin.github.io/react-menu/#basic-menu
import {
  Menu as LibMenu,
  MenuItem,
  MenuButton,
  MenuHeader,
  MenuDivider,
  SubMenu as LibSubMenu,
  applyHOC,
  applyStatics,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import "./Menu.css";

// TODO: Close menu when screen size changes (menu can go offscreen)

const COMMON_PROPS = {
  // Enable menu items to overflow in case they overextend the viewport
  overflow: "auto",
};

const Menu = applyHOC(function Menu({ ...rest }) {
  return <LibMenu {...rest} portal={true} {...COMMON_PROPS} />;
}, LibMenu);

const SubMenu = applyStatics(LibSubMenu)(function SubMenu({ ...rest }) {
  return <LibSubMenu {...rest} {...COMMON_PROPS} />;
});

// TODO: Apply HOC and adjust styling as necessary (overflow="auto" prop works
// on Menu & SubMenu outside of styling)
// @see https://szhsin.github.io/react-menu/#styles-prop for managing menu
// styles (maybe not necessary to override CSS manually)
// @see [HOC example] https://codesandbox.io/s/0bipn

// TODO: Implement keyboard accessibility across menu bar: https://szhsin.github.io/react-menu/docs#keyboard

// Controlled menu: https://szhsin.github.io/react-menu/docs#controlled-menu
// (look into unmountOnClose and using it for dynamic opening / closing of
// menus when mouse scrolls over menu buttons in menu bar)

// useMenuStateHook: https://szhsin.github.io/react-menu/docs#use-menu-state

export default Menu;
export { MenuItem, MenuButton, MenuHeader, MenuDivider, SubMenu };
