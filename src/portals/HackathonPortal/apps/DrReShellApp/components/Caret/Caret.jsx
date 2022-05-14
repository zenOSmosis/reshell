import styles from "./Caret.module.css";
import classNames from "classnames";
import PropTypes from "prop-types";

Caret.propTypes = {
  className: PropTypes.string,
  isBlinking: PropTypes.bool,
  content: PropTypes.string,
};

/**
 * Custom input caret.
 */
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
