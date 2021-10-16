// TODO: Rename to VirtualLink

import ButtonTransparent from "../ButtonTransparent";

import styles from "./Link.module.css";
import classNames from "classnames";

/**
 * NOTE: Fake links need to be a button, so this button is designed to look
 * like a real link, for the most part.
 */
export default function Link({ children, className, onClick, ...rest }) {
  return (
    <ButtonTransparent
      // IMPORTANT: The seemingly double link styles are placed on purpose (one
      // is the normal CSS, and the other is the module.css override)
      className={classNames("link", styles["link"], className)}
      onClick={onClick}
      {...rest}
    >
      {children}
    </ButtonTransparent>
  );
}
