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
  const [innerEl, setInnerEl] = useState(null);

  const isOverflown = useOverflowDetection(innerEl, canOverflow);

  return (
    <div
      className={classNames(
        styles["center"],
        canOverflow && isOverflown && styles["overflown"],
        className
      )}
    >
      <div ref={setInnerEl} {...rest} className={styles["inner-wrap"]}>
        {children}
      </div>
    </div>
  );
}
