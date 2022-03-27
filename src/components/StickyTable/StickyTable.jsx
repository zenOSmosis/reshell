import classNames from "classnames";
import styles from "./StickyTable.module.css";

/**
 * A light wrapper around HTML table elements which provides sticky thead and
 * tbody elements.
 *
 * @see https://css-tricks.com/making-tables-with-sticky-header-and-footers-got-a-bit-easier/
 * @see https://caniuse.com/css-sticky
 */
export default function StickyTable({ className, children, ...rest }) {
  return (
    <table className={classNames(styles["sticky"], className)} {...rest}>
      {children}
    </table>
  );
}
