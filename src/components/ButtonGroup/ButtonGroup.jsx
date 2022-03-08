import classNames from "classnames";
import styles from "./ButtonGroup.module.css";

// TODO: Add prop-types
// TODO: Document
// Used for wrapping arbitrary <button> HTML button elements with "global" base
// styling
export default function ButtonGroup({ children, className, ...rest }) {
  return (
    <div
      {...rest}
      className={classNames(
        styles["button-group"],
        // "Global" styling from base-styles.css
        "button-group",
        className
      )}
    >
      {children}
    </div>
  );
}
