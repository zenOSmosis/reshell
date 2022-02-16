import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import getIsElOverflown from "@utils/getIsElOverflown";
import requestSkippableAnimationFrame from "request-skippable-animation-frame";

import { v4 as uuidv4 } from "uuid";

/**
 * Fix issue on iOS 13 where ResizeObserver isn't available.
 */
import { install } from "resize-observer";
if (!window.ResizeObserver) {
  install();
}

/**
 * Determines if the given element is overflowing its container.
 *
 * Note: Some ideas were taken from these links, however the final solution
 * was not found within.
 * @see https://stackoverflow.com/questions/9333379/check-if-an-elements-content-is-overflowing
 * @see https://github.com/wojtekmaj/detect-element-overflow/blob/main/src/index.js
 *
 * @param {HTMLElement} element
 * @param {Object} isDetecting? [optional; default = true] Whether or not the
 * hook should detect overflow.
 * @return {boolean}
 */
export default function useOverflowDetection(element, isDetecting = true) {
  const refPrevIsOverflown = useRef(null);

  /**
   * @return {boolean} Whether or not the element is overflowing its parent.
   */
  const getIsOverflown = useCallback(
    () => getIsElOverflown(element),
    [element]
  );

  const [isOverflown, setIsOverflown] = useState(() => getIsOverflown());

  refPrevIsOverflown.current = isOverflown;

  const uuid = useMemo(uuidv4, []);

  useEffect(() => {
    if (isDetecting && element) {
      let _isUnmounting = false;

      /**
       * Handles checking of overflown, comparing it with previous state, and
       * determining if the hook state should be updated.
       *
       * Sets hook state once detection has been performed.
       *
       * @return {void}
       */
      const checkIsOverflown = () => {
        if (_isUnmounting) {
          return;
        }

        const prevIsOverflown = refPrevIsOverflown.current;

        const nextIsOverflown = getIsOverflown();

        if (prevIsOverflown !== nextIsOverflown) {
          setIsOverflown(nextIsOverflown);
        }
      };

      const ro = new ResizeObserver((/* entries */) => {
        /**
         * IMPORTANT: requestSkippableAnimationFrame is used here to prevent
         * possible "resize-observer loop limit exceeded error."
         *
         * "This error means that ResizeObserver was not able to deliver all
         * observations within a single animation frame. It is benign (your site
         * will not break)."
         *
         * @see https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
         */
        requestSkippableAnimationFrame(checkIsOverflown, uuid);
      });

      ro.observe(element);
      ro.observe(element.parentNode);

      /*
      const mo = new MutationObserver(() => {
        requestSkippableAnimationFrame(checkIsOverflown, uuid);
      });
      */

      // FIXME: (jh) Re-enable?
      /*
      mo.observe(element, {
        childList: true,
        subtree: true,
      });
      */

      return function unmount() {
        _isUnmounting = true;

        ro.observe(element);
        ro.unobserve(element.parentNode);
        // mo.disconnect();
      };
    }
  }, [isDetecting, element, getIsOverflown, uuid]);

  return isOverflown;
}
