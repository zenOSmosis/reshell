import React from "react";
import classNames from "classnames";
import styles from "./StackingContext.module.css";

// TODO: Document
// Also see: https://tiffanybbrown.com/2015/09/css-stacking-contexts-wtf/index.html
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
