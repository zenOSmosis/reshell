import styles from "./Caret.module.css";
import classNames from "classnames";

export default function Caret({ className, isBlinking = true, content = "■" }) {
  return (
    <div
      className={classNames(
        styles["caret"],
        isBlinking && styles["blinking"],
        className
      )}
    >
      {content}
    </div>
  );
}
