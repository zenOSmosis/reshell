import Full from "../Full";
import classNames from "classnames";
import styles from "./Layout.module.css";

export default function Footer({ className, children, ...rest }) {
  return (
    <div {...rest} className={classNames(styles["footer"], className)}>
      <Full>{children}</Full>
    </div>
  );
}
