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

  const getIsOverflown = useCallback(() => {
    if (element) {
      const offsetHeight = element.offsetHeight;
      const offsetWidth = element.offsetWidth;

      const parentNode = element.parentNode;

      const parentHeight = parentNode?.clientHeight;
      const parentWidth = parentNode?.clientWidth;

      if (parentHeight < offsetHeight || parentWidth < offsetWidth) {
        return true;
      } else {
        return false;
      }
    }
  }, [element]);

  const [isOverflown, setIsOverflown] = useState(getIsOverflown());

  // TODO: Debounce this (every render, debounce, use leading and trailing edges)
  // Force check on every render, if is detecting
  /*
  if (isDetecting && isOverflown !== getIsOverflown()) {
    setIsOverflown(!isOverflown);
  }
  */

  refPrevIsOverflown.current = isOverflown;

  useEffect(() => {
    if (isDetecting && element) {
      /**
       * Utilized for determining if overflown state should altered.
       *
       * @type {DOMElement | null}
       **/
      // let activeElement = null;

      /**
       * Handles checking of overflown, comparing it with previous state, and
       * determining if the hook state should be updated.
       */
      const checkIsOverflown = () => {
        const prevIsOverflown = refPrevIsOverflown.current;

        const nextIsOverflown = getIsOverflown();

        // activeElement = document.activeElement;

        // const focusedTagName = activeElement && activeElement.tagName;

        // Ignore overflow adjustments if there is a focused input which can
        // drive the software keyboard on mobile devices.
        //
        // This fixes an issue where it is not possible to type on Android in
        // an input / textarea which is a child of an overflow-able <Center />
        // component.
        // if (
        //  focusedTagName?.toLowerCase() !== "input" &&
        //  focusedTagName?.toLowerCase() !== "textarea"
        //) {
        if (prevIsOverflown !== nextIsOverflown) {
          setIsOverflown(nextIsOverflown);
        }
        //} else if (activeElement) {
        // activeElement.addEventListener("blur", checkIsOverflown);
        //}
      };

      const ro = new ResizeObserver(entries => {
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

      const mo = new MutationObserver(() => {
        window.requestAnimationFrame(checkIsOverflown);
      });

      // TODO: Re-enable
      /*
      mo.observe(element, {
        childList: true,
        subtree: true,
      });
      */

      return function unmount() {
        ro.observe(element);
        ro.unobserve(element.parentNode);
        mo.disconnect();

        // activeElement.removeEventListener("blur", checkIsOverflown);
      };
    }
  }, [isDetecting, element, getIsOverflown]);

  return isOverflown;
}
