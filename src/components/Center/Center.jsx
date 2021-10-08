import React, { useRef } from "react";

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
  const refInnerEl = useRef(null);

  const isOverflown = useOverflowDetection(refInnerEl.current, canOverflow);

  return (
    <div
      className={classNames(
        styles["center"],
        canOverflow && isOverflown && styles["overflown"],
        className
      )}
    >
      <div ref={refInnerEl} {...rest} className={styles["inner-wrap"]}>
        {children}
      </div>
    </div>
  );
}
