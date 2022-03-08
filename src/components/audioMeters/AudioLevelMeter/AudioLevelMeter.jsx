import React, { useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import styles from "./AudioLevelMeter.module.css";

import requestSkippableAnimationFrame from "request-skippable-animation-frame";
import { v4 as uuidv4 } from "uuid";

import PropTypes from "prop-types";

import useMultiAudioMediaStreamTrackLevelMonitor from "@hooks/useMultiAudioMediaStreamTrackLevelMonitor";

AudioLevelMeter.propTypes = {
  className: PropTypes.string,

  /** When multiple audio tracks may be used together */
  mediaStreamTracks: PropTypes.arrayOf(PropTypes.instanceOf(MediaStreamTrack)),

  /** When only a single track is used */
  mediaStreamTrack: PropTypes.instanceOf(MediaStreamTrack),
};

/**
 * A vertical bar audio meter which takes up its full available vertical space
 * by default.
 *
 * Borrowed from:
 * @see https://codepen.io/snart1/pen/rRvwwr
 */
export default function AudioLevelMeter({
  className,
  mediaStreamTrack,
  mediaStreamTracks,
  ...rest
}) {
  const [elAudioLevel, setElAudioLevel] = useState(null);

  // TODO: Replace w/ useUUID
  const uuid = useMemo(uuidv4, []);

  /**
   * @param {number} audioLevel A float value from 0 - 100, where 100
   * represents maximum strength.
   * @return {void}
   */
  const handleAudioLevelChange = useCallback(
    audioLevel => {
      if (elAudioLevel) {
        requestSkippableAnimationFrame(() => {
          // Inset is inverse of the audio level
          const inset = 100 - audioLevel;

          elAudioLevel.style.clipPath = `inset(${inset}% 0 0 0)`;
          elAudioLevel.style.WebkitClipPath = `inset(${inset}% 0 0 0)`;
        }, uuid);
      }
    },
    [elAudioLevel, uuid]
  );

  // Set initial level (otherwise they will default to appearing fully
  // maxed-out, due to the CSS rules)
  useEffect(() => {
    if (elAudioLevel) {
      handleAudioLevelChange(0);
    }
  }, [handleAudioLevelChange, elAudioLevel]);

  useMultiAudioMediaStreamTrackLevelMonitor(
    mediaStreamTrack || mediaStreamTracks,
    handleAudioLevelChange
  );

  return (
    <div className={classNames(styles["levels"], className)} {...rest}>
      {/*
        NOTE: The original version of this supported a nice multi-track
        reading, which is not compatible with this implementation. However it
        could be enabled by adapting the following to the current setup.

        {renderedLevels.map((percent, idx) => (
        */}

      <div className={styles["level-container"]}>
        <div ref={setElAudioLevel} className={styles["level"]}></div>
      </div>
      {/*
      ))}
      */}
    </div>
  );
}
