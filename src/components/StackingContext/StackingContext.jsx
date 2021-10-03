import React, { useCallback, useRef } from "react";
import classNames from "classnames";
import styles from "./StackingContext.module.css";

// TODO: Document
// Also see: https://tiffanybbrown.com/2015/09/css-stacking-contexts-wtf/index.html
const StackingContext = ({
  className,
  children,
  isAccelerated = false,
  onMount = () => null,
  onDOMMatrix = () => null,
  ...rest
}) => {
  const refOnMount = useRef(onMount);
  const refOnDOMMatrix = useRef(onDOMMatrix);

  const handleMount = useCallback(
    el => {
      const onMount = refOnMount.current;
      const onDOMMatrix = refOnDOMMatrix.current;

      if (isAccelerated) {
        // Handle 3D space detection and onDOMMatrix callback
        //
        // IMPORTANT: Use of setTimeout is to ensure we run this detection on
        // the next event loop cycle.  Usage of requestAnimationFrame does not
        // accurately detect 3D matrix.
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
        });
      }

      onMount(el);
    },
    [isAccelerated]
  );

  return (
    <div
      ref={handleMount}
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
};

export default StackingContext;
