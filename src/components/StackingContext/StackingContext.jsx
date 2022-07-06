/**
 * FIXME: (jh) This video might provide some interesting insight for stacking
 * context or layout components:
 * @see https://www.youtube.com/watch?v=Xt1Cw4qM3Ec (Secret Mechanisms of CSS)
 */

// Additional reading:
//  - CSS Containment: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Containment
//  - [proposed] CSS Container Queries: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Containment

import React from "react";
import classNames from "classnames";
import styles from "./StackingContext.module.css";

import PropTypes from "prop-types";

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
const StackingContext = React.forwardRef(
  ({ className, children, isAccelerated = false, ...rest }, ref) => {
    return (
      <div
        ref={ref}
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
);

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

export default StackingContext;
