import React from "react";
import classNames from "classnames";
import styles from "./RowColumn.module.css";
import PropTypes from "prop-types";

// @see https://dev.to/drews256/ridiculously-easy-row-and-column-layouts-with-flexbox-1k01

Row.propTypes = {
  className: PropTypes.string,

  /**
   * If false, the row will fill up the complete vertical space of its parent.
   *
   * Default value = false
   **/
  disableVerticalFill: PropTypes.bool,
};

// TODO: Document
function Row({ children, className, disableVerticalFill = false, ...rest }) {
  // TODO: Enforce that only Column components are direct descendants of this

  return (
    <div
      {...rest}
      className={classNames(
        styles["row"],
        disableVerticalFill && styles["disable-vertical-fill"],
        className
      )}
    >
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
