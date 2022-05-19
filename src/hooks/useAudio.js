import { useCallback, useEffect, useMemo, useState } from "react";
import { Howl } from "howler";

/**
 * React hook wrapper around Howler audio which enables multiple instances of
 * the given sound(s) to play concurrently, if desired.
 *
 * NOTE: There is a bug w/ Safari 15.3 which sometimes doesn't play this
 * audio:
 * https://github.com/goldfire/howler.js/issues/1576
 *
 * @see https://github.com/goldfire/howler.js
 *
 * @param {string || string[]} srcOrSrcList
 * @return {{play: () => void, isPreloaded: boolean}}
 */
export default function useAudio(srcOrSrcList, format = null) {
  const [isPreloaded, setIsPreloaded] = useState(true);

  const sound = useMemo(
    () =>
      srcOrSrcList &&
      new Howl({
        src: !Array.isArray(srcOrSrcList) ? [srcOrSrcList] : srcOrSrcList,
        format,
        html5: false,
      }),
    [srcOrSrcList, format]
  );

  // Handle preload state on mount and sound unloading on unmount
  useEffect(() => {
    if (sound) {
      const handlePreloaded = () => setIsPreloaded(true);

      if (sound.state() === "loaded") {
        handlePreloaded();
      } else {
        sound.once("load", handlePreloaded);
      }

      return () => {
        sound.unload();
      };
    }
  }, [sound]);

  const play = useCallback(() => sound?.play(), [sound]);

  return {
    play,
    isPreloaded,
  };
}
