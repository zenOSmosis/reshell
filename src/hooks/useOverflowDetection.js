import { useCallback, useEffect, useRef, useState } from "react";

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
  const getIsOverflown = useCallback(() => {
    if (element) {
      // Height / width of the inner element, including padding and borders
      // @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetHeight
      const innerOffsetHeight = element.offsetHeight;
      const innerOffsetWidth = element.offsetWidth;

      const parentNode = element.parentNode;

      // Height / width of the outer element, including padding but excluding
      // borders, margins, and scrollbars
      // @see https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight
      const outerHeight = parentNode?.clientHeight;
      const outerWidth = parentNode?.clientWidth;

      if (outerHeight < innerOffsetHeight || outerWidth < innerOffsetWidth) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }, [element]);

  const [isOverflown, setIsOverflown] = useState(() => getIsOverflown());

  refPrevIsOverflown.current = isOverflown;

  useEffect(() => {
    if (isDetecting && element) {
      /**
       * Handles checking of overflown, comparing it with previous state, and
       * determining if the hook state should be updated.
       *
       * Sets hook state once detection has been performed.
       *
       * @return {void}
       */
      const checkIsOverflown = () => {
        const prevIsOverflown = refPrevIsOverflown.current;

        const nextIsOverflown = getIsOverflown();

        if (prevIsOverflown !== nextIsOverflown) {
          setIsOverflown(nextIsOverflown);
        }
      };

      const ro = new ResizeObserver((/* entries */) => {
        /**
         * IMPORTANT: requestAnimationFrame is used here to prevent possible
         * "resize-observer loop limit exceeded error."
         *
         * "This error means that ResizeObserver was not able to deliver all
         * observations within a single animation frame. It is benign (your site
         * will not break)."
         *
         * @see https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
         */
        window.requestAnimationFrame(checkIsOverflown);
      });

      ro.observe(element);
      ro.observe(element.parentNode);

      /*
      const mo = new MutationObserver(() => {
        window.requestAnimationFrame(checkIsOverflown);
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
        ro.observe(element);
        ro.unobserve(element.parentNode);
        // mo.disconnect();
      };
    }
  }, [isDetecting, element, getIsOverflown]);

  return isOverflown;
}
