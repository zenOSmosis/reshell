import ButtonTransparent from "../ButtonTransparent";

import styles from "./VirtualLink.module.css";
import classNames from "classnames";

/**
 * NOTE: Fake links need to be a button, so this button is designed to look
 * like a real link, for the most part.
 */
export default function VirtualLink({ children, className, onClick, ...rest }) {
  return (
    <ButtonTransparent
      {...rest}
      // IMPORTANT: The seemingly double link styles are placed on purpose (one
      // is the normal CSS, and the other is the module.css override)
      className={classNames("link", styles["virtual-link"], className)}
      onClick={onClick}
    >
      {children}
    </ButtonTransparent>
  );
}
