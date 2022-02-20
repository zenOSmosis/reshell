// Basic wrapper interface around react-menu which the data-driven menu builds
// on top of.

// @see https://szhsin.github.io/react-menu/#basic-menu
import {
  ControlledMenu as LibControlledMenu,
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
import "./Menu.LibWrapper.css";

const COMMON_PROPS = {
  // Enable menu items to overflow in case they overextend the viewport
  overflow: "auto",
};

const ControlledMenu = applyHOC(function Menu({ ...rest }) {
  return <LibControlledMenu {...rest} portal={true} {...COMMON_PROPS} />;
}, LibControlledMenu);

const SubMenu = applyStatics(LibSubMenu)(function SubMenu({ ...rest }) {
  return <LibSubMenu {...rest} {...COMMON_PROPS} />;
});

// TODO: Apply HOC and adjust styling as necessary (overflow="auto" prop works
// on Menu & SubMenu outside of styling)
// @see https://szhsin.github.io/react-menu/#styles-prop for managing menu
// styles (maybe not necessary to override CSS manually)
// @see [HOC example] https://codesandbox.io/s/0bipn

export default ControlledMenu;
export { MenuItem, MenuButton, MenuHeader, MenuDivider, SubMenu };
