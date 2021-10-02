import classNames from "classnames";
import styles from "./NoWrap.module.css";

export default function NoWrap({ children, className, ...rest }) {
  return (
    <span {...rest} className={classNames(styles["no-wrap"], className)}>
      {children}
    </span>
  );
}
