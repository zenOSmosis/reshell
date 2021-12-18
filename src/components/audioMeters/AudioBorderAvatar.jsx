import React, { useCallback, useState } from "react";
import Avatar from "../Avatar";

import PropTypes from "prop-types";

import useMultiAudioMediaStreamTrackLevelMonitor from "@hooks/useMultiAudioMediaStreamTrackLevelMonitor";
import getPercentColor from "@utils/getPercentColor";

AudioBorderAvatar.propTypes = {
  /** When multiple audio tracks may be used together */
  mediaStreamTracks: PropTypes.arrayOf(PropTypes.instanceOf(MediaStreamTrack)),

  /** When only a single track is used */
  mediaStreamTrack: PropTypes.instanceOf(MediaStreamTrack),
};

/**
 * An avatar with a border which changes colors based on the current audio
 * level(s).
 */
export default function AudioBorderAvatar({
  mediaStreamTracks,
  mediaStreamTrack,
  ...rest
}) {
  const [elAvatar, setElAvatar] = useState(null);

  /**
   * @param {number} audioLevel A float value from 0 - 100, where 100
   * represents maximum strength.
   * @return {void}
   */
  const handleAudioLevelChange = useCallback(
    audioLevel => {
      if (elAvatar) {
        window.requestAnimationFrame(() => {
          // TODO: Add percent calculation into getPercentColor itself
          elAvatar.style.borderColor = getPercentColor(audioLevel / 100);
        });
      }
    },
    [elAvatar]
  );

  useMultiAudioMediaStreamTrackLevelMonitor(
    mediaStreamTrack || mediaStreamTracks,
    handleAudioLevelChange
  );

  return <Avatar {...rest} onEl={setElAvatar} />;
}
