import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import styles from "./StackingContext.module.css";

import PropTypes from "prop-types";

// Amount of time, in milliseconds, to wait before trying to determine if a 2D
// or 3D matrix
const MATRIX_DETECTION_DELAY = 100;

StackingContext.propTypes = {
  /**
   * Whether or not the stacking context should be GPU accelerated
   *
   * [default = false]
   **/
  isAccelerated: PropTypes.bool,

  /**
   * Called, with the DOM element of the stacking context after it renders to
   * the DOM.
   **/
  onMount: PropTypes.func,

  /**
   * Called, with the DOM Matrix, after acquisition from the stacking context.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix
   */
  onDOMMatrix: PropTypes.func,
};

/**
 * Description from MDN Web Docs: The stacking context is a three-dimensional
 * conceptualization of HTML elements along an imaginary z-axis relative to the
 * user, who is assumed to be facing the viewport or the webpage. HTML elements
 * occupy this space in priority order based on element attributes.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
 *
 * NOTE: This component contains some small trickery to try to GPU accelerate
 * the component and its children.  By default, this functionality is not
 * utilized and it is recommended to only use it for various components of the
 * web app, instead of the entire thing.
 */
export default function StackingContext({
  className,
  children,
  isAccelerated = false,
  onMount = () => null,
  onDOMMatrix = () => null,
  ...rest
}) {
  const refOnMount = useRef(onMount);
  const refOnDOMMatrix = useRef(onDOMMatrix);
  const refIsAccelerated = useRef(isAccelerated);

  const refEl = useRef(null);

  // Handle onMount and onDOMMatrix callbacks
  useEffect(() => {
    const el = refEl.current;

    if (el) {
      const onMount = refOnMount.current;
      const onDOMMatrix = refOnDOMMatrix.current;
      const isAccelerated = refIsAccelerated.current;

      if (isAccelerated) {
        // Handle 3D space detection and onDOMMatrix callback
        //
        // FIXME: (jh) Use of setTimeout fixes an issue where is2D didn't seem
        // to be accurate on the first render, and possibly some subsequent
        // render attempts.  I'm not positive this has fixed it for good and it
        // might need to be investigated some more.
        setTimeout(() => {
          const computedStyle = window.getComputedStyle(el);

          /** @see https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix */
          const matrix = new DOMMatrix(computedStyle.transform);

          /**
           * NOTE: Each matrix value will be a string, not a number
           *
           * @see https://zellwk.com/blog/css-translate-values-in-javascript/
           **/
          /*
            const matrixValues = computedStyle.transform
              .match(/matrix.*\((.+)\)/)[1]
              .split(", ");*/

          // NOTE: (jh) It seems that the matrix can be 3D and still not be
          // accelerated, so some further considerations may need to be made

          if (matrix.is2D /* || matrixValues[14] === undefined*/) {
            console.warn(
              "Unable to apply, or detect, added 3D space to accelerated element",
              el
            );
          }

          onDOMMatrix(matrix);
        }, MATRIX_DETECTION_DELAY);
      }

      onMount(el);
    }
  }, []);

  return (
    <div
      ref={refEl}
      {...rest}
      className={classNames(
        styles["stacking-context"],
        isAccelerated && styles["accelerated"],
        className
      )}
    >
      {children}
    </div>
  );
}
