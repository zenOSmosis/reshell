import React, { Component } from "react";
import StackingContext from "../StackingContext";
import classNames from "classnames";
import styles from "./Full.module.css";

// FIXME: Convert to function-based component (special note: may need to
// forward refs for some other components)
class Full extends Component {
  render() {
    const { children, className, ...rest } = this.props;

    return (
      <StackingContext
        {...rest}
        className={classNames(styles["full"], className)}
      >
        {children}
      </StackingContext>
    );
  }
}

export default Full;
