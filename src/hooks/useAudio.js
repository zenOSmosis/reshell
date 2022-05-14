import { useCallback, useEffect, useMemo, useState } from "react";
import { Howl } from "howler";

/**
 * NOTE: There is a bug w/ Safari 15.3 which doesn't play this audio
 * https://github.com/goldfire/howler.js/issues/1576
 *
 * @see https://github.com/goldfire/howler.js
 *
 * @param {string || string[]} srcOrSrcList
 * @return {Object} // TODO: Document object
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

  return useMemo(
    () => ({
      play,
      isPreloaded,
    }),
    [play, isPreloaded]
  );
}
