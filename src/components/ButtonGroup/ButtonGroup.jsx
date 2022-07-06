import classNames from "classnames";
import styles from "./ButtonGroup.module.css";

// TODO: Add prop-types
// Used for wrapping arbitrary <button> HTML button elements with "global" base
// styling
// TODO: Include support for optional line breaks

/**
 * Styles child buttons so they appear as a single unit.
 */
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
