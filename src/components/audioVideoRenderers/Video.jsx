import React from "react";
import classNames from "classnames";
import styles from "./Video.module.css";

import AVBase from "./AVBase";

// NOTE: (jh) There is also an aspect-ratio CSS property:
// @see https://css-tricks.com/almanac/properties/a/aspect-ratio/

/**
 * Plays a single video MediaStreamTrack out the monitor.
 */
export default function Video({ className, ...rest }) {
  return (
    <AVBase className={classNames(styles["video"], className)} {...rest} />
  );
}
