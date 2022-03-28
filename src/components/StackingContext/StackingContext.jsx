/**
 * FIXME: (jh) This video might provide some interesting insight for stacking
 * context or layout components:
 * @see https://www.youtube.com/watch?v=Xt1Cw4qM3Ec (Secret Mechanisms of CSS)
 */

import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import styles from "./StackingContext.module.css";

import PropTypes from "prop-types";

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
  ...rest
}) {
  const refOnMount = useRef(onMount);

  const refEl = useRef(null);

  // Handle onMount and onDOMMatrix callbacks
  useEffect(() => {
    const el = refEl.current;

    if (el) {
      const onMount = refOnMount.current;

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
