import { useCallback, useState } from "react";

import useMultiAudioMediaStreamTrackLevelMonitor from "@hooks/useMultiAudioMediaStreamTrackLevelMonitor";

import requestSkippableAnimationFrame from "request-skippable-animation-frame";
import useUUID from "@hooks/useUUID";

import Speaker from "@components/Speaker";

export default function WooferAudioLevelMeter({
  mediaStreamTrack,
  mediaStreamTracks,
  className,
  ...rest
}) {
  const [elInnerCone, setElInnerCone] = useState(null);
  const [elMidCone, setElMidCone] = useState(null);
  const [elOuterCone, setElOuterCone] = useState(null);

  const uuid = useUUID();

  /**
   * @param {number} audioLevel A float value from 0 - 100, where 100
   * represents maximum strength.
   * @return {void}
   */
  const handleAudioLevelChange = useCallback(
    audioLevel => {
      if (elInnerCone && elMidCone && elOuterCone) {
        requestSkippableAnimationFrame(() => {
          // TODO: Add percent calculation into getPercentColor itself
          // elSVG.style.fill = getPercentColor(audioLevel / 100);

          // TODO: Map to frequency bin

          audioLevel = audioLevel / 35;

          // bin 3 : ~86 Hz - kick drum
          elOuterCone.style.transform = `scale(${1 + audioLevel * 0.01})`;

          // bin 8 : ~301 Hz - low snare
          elMidCone.style.transform = `scale(${1 + audioLevel * 0.1})`;

          // bin 17 : ~689 Hz - high snare
          elInnerCone.style.transform = `scale(${1 + audioLevel * 0.05})`;
        }, uuid);
      }
    },
    [elInnerCone, elMidCone, elOuterCone, uuid]
  );

  useMultiAudioMediaStreamTrackLevelMonitor(
    mediaStreamTrack || mediaStreamTracks,
    handleAudioLevelChange
  );

  return (
    <Speaker
      {...rest}
      onMountOuterCone={setElOuterCone}
      onMountMidCone={setElMidCone}
      onMountInnerCone={setElInnerCone}
    />
  );
}
