import { useCallback, useState } from "react";
import { ReactSVG } from "react-svg";
import Preload from "../../Preload";

import SpeakerLogo from "@portals/SpeakerAppPortal/assets/speaker.app.logo.svg";

import styles from "./ColoredSpeakerAudioLevelMeter.module.css";
import classNames from "classnames";

import useMultiAudioMediaStreamTrackLevelMonitor from "@hooks/useMultiAudioMediaStreamTrackLevelMonitor";
import getPercentColor from "@utils/getPercentColor";

import requestSkippableAnimationFrame from "request-skippable-animation-frame";
import useUUID from "@hooks/useUUID";

// TODO: Document
// TODO: Add prop-types
export default function ColoredSpeakerAudioLevelMeter({
  mediaStreamTrack,
  mediaStreamTracks,
  className,
  ...rest
}) {
  // TODO: Use preloader

  const [elSVG, setElSVG] = useState(null);

  const uuid = useUUID();

  /**
   * @param {number} audioLevel A float value from 0 - 100, where 100
   * represents maximum strength.
   * @return {void}
   */
  const handleAudioLevelChange = useCallback(
    audioLevel => {
      if (elSVG) {
        requestSkippableAnimationFrame(() => {
          // TODO: Add percent calculation into getPercentColor itself
          elSVG.style.fill = getPercentColor(audioLevel / 100);
        }, uuid);
      }
    },
    [elSVG, uuid]
  );

  useMultiAudioMediaStreamTrackLevelMonitor(
    mediaStreamTrack || mediaStreamTracks,
    handleAudioLevelChange
  );

  return (
    <Preload {...rest} preloadResources={[SpeakerLogo]}>
      <div {...rest} className={classNames(styles["speaker"], className)}>
        <ReactSVG beforeInjection={setElSVG} src={SpeakerLogo} />
      </div>
    </Preload>
  );
}
