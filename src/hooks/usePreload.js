import { useEffect, useMemo, useRef, useState } from "react";
import Preload from "preload-it";

/**
 * Pre-loads resources, as a React hook.
 *
 * @param {string[]} srcList An array of URLs to preload. Note that these are
 * cached and the list cannot be changed without re-instantiating the hook.
 * @return {{isPreloaded: boolean, progress: number}}
 */
export default function usePreload(srcList) {
  const [isPreloaded, _setIsPreloaded] = useState(false);
  const [progress, _setProgress] = useState(0);

  // Cache the srcList; This fixes an issue where passing in a non-memoized
  // array could cause the following useEffect to trigger more than once.
  //
  // Issue was discovered when images would preload multiple times in Firefox.
  const refSrcList = useRef(srcList);

  useEffect(() => {
    const resources = refSrcList.current;

    if (resources && !Array.isArray(resources)) {
      throw new Error("usePreload resources should be an array");
    }

    if (resources.length) {
      const preload = new Preload();

      preload.onprogress = evt => {
        _setProgress(evt.progress);
      };

      preload.oncomplete = (/* items */) => {
        _setIsPreloaded(true);
      };

      preload.fetch(resources);

      // FIXME: (jh) Retry fetch if browser is offline, then comes online again
    } else {
      // No resources to load; proceed
      _setIsPreloaded(true);
      _setProgress(100);
    }
  }, []);

  return useMemo(
    () => ({
      isPreloaded,
      progress,
    }),
    [isPreloaded, progress]
  );
}
