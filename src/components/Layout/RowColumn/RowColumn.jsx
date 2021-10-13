import React from "react";
import classNames from "classnames";
import styles from "./RowColumn.module.css";
// import PropTypes from "prop-types";

// @see https://dev.to/drews256/ridiculously-easy-row-and-column-layouts-with-flexbox-1k01

// TODO: Implement prop-types
function Row({ children, className, ...rest }) {
  // TODO: Enforce that only Column components are direct children of this

  return (
    <div {...rest} className={classNames(styles["row"], className)}>
      {children}
    </div>
  );
}

// TODO: Implement prop-types
/**
 * Evenly-sized column.
 */
function Column({ children, className, ...rest }) {
  // TODO: Enforce that only Row component is direct parent of this

  return (
    <div {...rest} className={classNames(styles["column"], className)}>
      {children}
    </div>
  );
}

export { Row, Column };
