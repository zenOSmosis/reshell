import classNames from "classnames";
import styles from "./NoWrap.module.css";

// TODO: Document
export default function NoWrap({ children, className, ...rest }) {
  return (
    <div {...rest} className={classNames(styles["no-wrap"], className)}>
      {children}
    </div>
  );
}
