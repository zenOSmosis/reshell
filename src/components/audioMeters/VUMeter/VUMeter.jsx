import React, { useCallback, useEffect, useMemo, useState } from "react";
import Preload from "@components/Preload";

import classNames from "classnames";
import styles from "./VUMeter.module.css";

import PropTypes from "prop-types";

import useMultiAudioMediaStreamTrackLevelMonitor from "@hooks/useMultiAudioMediaStreamTrackLevelMonitor";

import requestSkippableAnimationFrame from "@utils/requestSkippableAnimationFrame";
import { v4 as uuidv4 } from "uuid";

import vuBackground from "./images/vu.png";
import vuNeedle from "./images/needle.png";

VUMeter.propTypes = {
  label: PropTypes.string,

  className: PropTypes.string,

  /** When multiple audio tracks may be used together */
  mediaStreamTracks: PropTypes.arrayOf(PropTypes.instanceOf(MediaStreamTrack)),

  /** When only a single track is used */
  mediaStreamTrack: PropTypes.instanceOf(MediaStreamTrack),
};

/**
 * A needle-based audio meter.
 */
export default function VUMeter({
  label = "Mono",
  className,
  mediaStreamTrack,
  mediaStreamTracks,
  ...rest
}) {
  const [elVU, setElVU] = useState(null);
  const [elNeedle, setElNeedle] = useState(null);

  const uuid = useMemo(uuidv4, []);

  useEffect(() => {
    if (elVU && elNeedle) {
      elVU.style.backgroundImage = `url(${vuBackground})`;
      elVU.style.backgroundPosition = "top left";
      elVU.style.backgroundRepeat = "no-repeat";

      elNeedle.style.backgroundImage = `url(${vuNeedle})`;
      elNeedle.style.backgroundPosition = "top left";
      elNeedle.style.backgroundRepeat = "no-repeat";
    }
  }, [elVU, elNeedle]);

  /**
   * @param {number} audioLevel A float value from 0 - 100, where 100
   * represents maximum strength.
   * @return {void}
   */
  const handleAudioLevelChange = useCallback(
    audioLevel => {
      if (elNeedle) {
        requestSkippableAnimationFrame(() => {
          elNeedle.style.transform = `rotateZ(${Math.min(
            87 * (audioLevel / 100)
          )}deg)`;
        }, uuid);
      }
    },
    [elNeedle, uuid]
  );

  // Set initial level
  useEffect(() => {
    if (elNeedle) {
      handleAudioLevelChange(0);
    }
  }, [handleAudioLevelChange, elNeedle]);

  useMultiAudioMediaStreamTrackLevelMonitor(
    mediaStreamTrack || mediaStreamTracks,
    handleAudioLevelChange
  );

  return (
    <Preload preloadResources={[vuBackground, vuNeedle]}>
      <div
        ref={setElVU}
        className={classNames(styles["vu"], className)}
        {...rest}
      >
        <div className={styles["mask"]}>
          <div
            ref={setElNeedle}
            className={styles["needle"]}
            style={{ transform: "rotateZ(0deg)" }}
          ></div>
        </div>
        <p className={styles["vu-label"]}>{label}</p>
      </div>
    </Preload>
  );
}
