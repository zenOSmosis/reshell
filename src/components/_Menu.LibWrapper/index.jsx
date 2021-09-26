// @see https://szhsin.github.io/react-menu/#basic-menu
import {
  Menu,
  MenuItem,
  MenuButton,
  MenuHeader,
  MenuDivider,
  SubMenu,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import "./Menu.css";

// TODO: Close menu when screen size changes (menu can go offscreen)

export default Menu;
export { MenuItem, MenuButton, MenuHeader, MenuDivider, SubMenu };
