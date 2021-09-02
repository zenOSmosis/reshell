import React from "react";
import classNames from "classnames";
import styles from "./StackingContext.module.css";

// TODO: Document
const StackingContext = ({ className, children, onMount, ...propsRest }) => {
  return (
    <div
      ref={onMount}
      {...propsRest}
      className={classNames(styles["stacking-context"], className)}
    >
      {children}
    </div>
  );
};

export default StackingContext;
