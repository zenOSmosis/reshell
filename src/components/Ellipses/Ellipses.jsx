import classNames from "classnames";
import styles from "./Ellipses.module.css";

/**
 * Adds an ellipses to overflown text.
 *
 * Note: This is currently only set up for single-line-mode.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow
 */
export default function Ellipses({ children, className, ...rest }) {
  return (
    <div
      {...rest}
      className={classNames(
        styles["ellipses"],
        styles["single-line"],
        className
      )}
    >
      {children}
    </div>
  );
}
