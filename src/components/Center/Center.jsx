import React, { useState } from "react";

import classNames from "classnames";
import styles from "./Center.module.css";

import useOverflowDetection from "@hooks/useOverflowDetection";

import PropTypes from "prop-types";

Center.propTypes = {
  /**
   * Whether or not content can overflow when the Center content overflows it
   * outer wrapper.
   */
  canOverflow: PropTypes.bool,
};

export default function Center({
  children,
  className,
  canOverflow = false,
  ...rest
}) {
  const [centerEl, _setCenterEl] = useState(null);

  const isOverflown = useOverflowDetection(centerEl, canOverflow);

  if (canOverflow && isOverflown) {
    // Display without flex centering
    return (
      <div
        ref={_setCenterEl}
        className={classNames(
          styles["overflown"],
          styles["inner-wrap"],
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={_setCenterEl}
      {...rest}
      className={classNames(styles["center"], className)}
    >
      <div className={styles["inner-wrap"]}>{children}</div>
    </div>
  );
}
