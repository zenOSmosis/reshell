import Full from "../Full";

import styles from "./Padding.module.css";
import classNames from "classnames";

export default function Padding({ children, className, ...rest }) {
  return (
    <Full {...rest} className={classNames(styles["padding"], className)}>
      {children}
    </Full>
  );
}
