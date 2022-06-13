import React, { useEffect, useRef } from "react";
import LibControlledMenu, {
  MenuItem as LibMenuItem,
  SubMenu as LibSubMenu,
  MenuDivider as LibMenuDivider,
  MenuHeader as LibMenuHeader,
} from "./_Menu.LibWrapper";

import PropTypes from "prop-types";

import classNames from "classnames";

Menu.propTypes = {
  /**
   * FIXME: (jh) Document structure
   *
   * Reference example:
   * @see {@link https://www.electronjs.org/docs/api/menu#examples}
   */
  menuStructure: PropTypes.object.isRequired,

  /** If set to true, the menu will be opened */
  opened: PropTypes.bool,

  /**
   * Invoked once the menu opens, or the internal logic determines the menu
   * should open. The containing component should set "opened" as necessary,
   * depending on this state.
   **/
  onOpen: PropTypes.func,

  /**
   * Invoked once the menu closes, or the internal logic determines the menu
   * should be closed. The containing component should set "opened" as
   * necessary, depending on this state.
   **/
  onClose: PropTypes.func,
};

/**
 * Wraps react-menu with data structure handling which is mostly compatible
 * with Electron's menu API.
 *
 * @see {@link https://www.electronjs.org/docs/api/menu#examples}
 */
export default function Menu({
  menuStructure,
  opened = false,
  onOpen = () => null,
  onClose = () => null,
  ...rest
}) {
  // Coordinates the button position with the menu
  const refAnchor = useRef(null);

  // Close menu when screen size changes (menu can go offscreen, or be
  // incorrectly positioned otherwise)
  useEffect(() => {
    // TODO: Use common handler instead
    window.addEventListener("resize", onClose);

    return () => {
      window.removeEventListener("resize", onClose);
    };
  }, [onClose]);

  return (
    <>
      <button
        ref={refAnchor}
        {...rest}
        // Retain non-controlled class for easier styling
        className={classNames(
          "szh-menu-button",
          opened && "szh-menu-button--open"
        )}
        // NOTE: onMouseDown also works on mobile (thanks to React) and fixes
        // issue where onClick handling would always result in an open state,
        // never togging off
        onMouseDown={() => {
          // NOTE: This queueMicrotask call fixes an issue with Firefox where
          // selecting a menu item in the list, then clicking on the menu
          // button again would not activate the menu button without a double-
          // click
          queueMicrotask(() => {
            opened ? onClose() : onOpen();
          });
        }}
        disabled={menuStructure.disabled}
      >
        {
          // TODO: Normalize label / role handling
        }
        {menuStructure.label || menuStructure.role}
      </button>

      {
        // NOTE: useMenuStateHook may be of eventual interest here:
        // @see https://szhsin.github.io/react-menu/docs#use-menu-state
      }
      <LibControlledMenu
        anchorRef={refAnchor}
        // NOTE: The controlled menu cannot be initially opened to true (see
        // related issue: https://github.com/szhsin/react-menu/issues/2#issuecomment-719166062)
        // This issue was caused by hovering a menu option in a structure
        // beyond the first (i.e. "Restore" in "Window" menu), then clicking on
        // the desktop itself, then re-selecting the window.
        state={refAnchor.current && opened ? "open" : "closed"}
        // NOTE: onClose binds to escape / non-child pointer clicks
        onClose={onClose}
        portal={true}
      >
        {xChildren(menuStructure)}
      </LibControlledMenu>
    </>
  );
}

/**
 * Provides dynamic, data-driven children for the given menu structure.
 *
 * NOTE: This function may call itself recursively if there is a child sub
 * menu.
 *
 * IMPORTANT: This is NOT a React component itself.
 *
 * @param {Object} menuStructure
 * @return {React.FC[]}
 */
function xChildren(menuStructure) {
  const children = [];

  // Every top-level menu has a submenu
  for (const item of menuStructure.submenu) {
    if (item.type === "separator") {
      children.push(<LibMenuDivider key={children.length} />);
      // NOTE: This doesn't seem to conform to Electron's API
      if (item.label) {
        children.push(
          <LibMenuHeader key={children.length}>{item.label}</LibMenuHeader>
        );
      }
    } else {
      if (item.submenu) {
        children.push(
          <LibSubMenu key={children.length} label={item.label}>
            {xChildren(item)}
          </LibSubMenu>
        );
      } else {
        /**
         * @see {@link https://www.electronjs.org/docs/latest/api/menu-item}
         * @see {@link https://szhsin.github.io/react-menu/docs#menu-item}
         */
        children.push(
          <LibMenuItem
            key={children.length}
            onClick={item.click}
            disabled={item.disabled}
            checked={item.checked}
            // FIXME: (jh) Update checkbox handling
            // @see https://szhsin.github.io/react-menu/docs#menu-item
            // @see https://www.electronjs.org/docs/latest/api/menu-item
            type={item.type}
          >
            {
              // TODO: Normalize label / role handling
            }
            {item.role || item.label}
          </LibMenuItem>
        );
      }
    }
  }

  return children;
}
