import React from "react";
import classNames from "classnames";
import styles from "./ButtonTransparent.module.css";

// TODO: Rename to ButtonUnstyled?
function ButtonTransparent({ children, className, ...rest }) {
  return (
    <button
      className={classNames(
        styles["button-transparent"],
        "unstyled",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export default ButtonTransparent;
