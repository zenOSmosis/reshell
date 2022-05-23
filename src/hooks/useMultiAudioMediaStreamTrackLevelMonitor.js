import { useEffect, useMemo, useRef, useState } from "react";
import { MultiAudioMediaStreamTrackLevelMonitor } from "media-stream-track-controller";
import useArrayDiff from "./useArrayDiff";

const { EVT_AUDIO_LEVEL_UPDATE } = MultiAudioMediaStreamTrackLevelMonitor;

/**
 * Utilizes a MultiAudioMediaStreamTrackLevelMonitor as a React hook.
 *
 * @param {MediaStreamTrack | MediaStreamTrack[] | null} mediaStreamTrackOrTracks?
 * [default = []] A single track, or an array of tracks.  It is made optional
 * because rendered audio level meters may not already have an associated
 * MediaStreamTrack. NOTE: It will automatically filter out non-audio tracks.
 * @param {function} onAudioLevelChange Callback which is executed each time the audio level is changed.
 * @return {void}
 */
export default function useMultiAudioMediaStreamTrackLevelMonitor(
  mediaStreamTrackOrTracks = [],
  onAudioLevelChange
) {
  /**
   * @type {MediaStreamTrack[]}
   */
  const mediaStreamTracks = useMemo(
    () =>
      (!mediaStreamTrackOrTracks
        ? []
        : Array.isArray(mediaStreamTrackOrTracks)
        ? mediaStreamTrackOrTracks
        : [mediaStreamTrackOrTracks]
      ).filter(
        track => track instanceof MediaStreamTrack && track.kind === "audio"
      ),
    [mediaStreamTrackOrTracks]
  );

  const [mediaStreamMonitor, _setMediaStreamMonitor] = useState(null);

  const refOnAudioLevelChange = useRef(onAudioLevelChange);
  refOnAudioLevelChange.current = onAudioLevelChange;

  // Instantiate and bind MultiAudioMediaStreamTrackLevelMonitor audio level
  // state to hook state
  useEffect(() => {
    const mediaStreamMonitor = new MultiAudioMediaStreamTrackLevelMonitor();

    // NOTE: This event handler will automatically be unbound once the class
    // destructs
    mediaStreamMonitor.on(EVT_AUDIO_LEVEL_UPDATE, audioLevel => {
      refOnAudioLevelChange.current(audioLevel);
    });

    _setMediaStreamMonitor(mediaStreamMonitor);

    return function unmount() {
      if (!mediaStreamMonitor.getHasDestroyStarted()) {
        mediaStreamMonitor.destroy();
      }
    };
  }, []);

  const { added: addedMediaStreamTracks, removed: removedMediaStreamTracks } =
    useArrayDiff(mediaStreamTracks);

  // Sync hook's media stream tracks with the audio monitor instance
  useEffect(() => {
    if (mediaStreamMonitor) {
      // Handle added / existing tracks
      for (const track of addedMediaStreamTracks) {
        mediaStreamMonitor.addMediaStreamTrack(track);
      }

      // Handle removed tracks
      for (const track of removedMediaStreamTracks) {
        mediaStreamMonitor.removeMediaStreamTrack(track);
      }
    }
  }, [mediaStreamMonitor, addedMediaStreamTracks, removedMediaStreamTracks]);
}
