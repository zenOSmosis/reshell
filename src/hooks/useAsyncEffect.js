import { useEffect } from "react";

/**
 * Runs a useEffect in an asynchronous mode.
 *
 * Note: This passes an abortController to the asynchronous callback so that it
 * can be aware the process is aborting.
 *
 * @param {Function} callback
 * @param {any[]} deps
 * @return {void}
 */
export default function useAsyncEffect(callback, deps = []) {
  useEffect(
    () => {
      const abortController = new AbortController();

      let cbCleanup = null;

      (async () => {
        cbCleanup = await callback(abortController);
      })();

      return () => {
        abortController.abort();

        if (typeof cbRet === "function") {
          cbCleanup();
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback, ...deps]
  );
}
