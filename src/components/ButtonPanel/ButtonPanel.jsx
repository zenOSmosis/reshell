import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

ButtonPanel.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      // TODO: Require to be React component (or any?)
      // TODO: Rename to view, or label
      content: PropTypes.any.isRequired,

      onClick: PropTypes.func.isRequired,

      type: PropTypes.string,

      disabled: PropTypes.bool,

      // Optional style override
      style: PropTypes.string,

      // Optional style override
      className: PropTypes.string,

      /** If set to true, this acts as the default button */
      isSelected: PropTypes.bool,
    })
  ),
};

/**
 * ButtonPanel is utilized for a set of buttons which need to maintain state
 * relative to one another, operating much like radio controls.
 */
export default function ButtonPanel({ buttons, className, ...rest }) {
  const [selectedIdx, setSelectedIdx] = useState(() => {
    let selectedIdx = 0;

    buttons.forEach((button, idx) => {
      if (button.isSelected) {
        selectedIdx = idx;
      }
    });

    return selectedIdx;
  });

  // TODO: Document
  const refRenderIdx = useRef(-1);
  ++refRenderIdx.current;

  return (
    <div className={classNames("button-group", className)} {...rest}>
      {buttons.map(
        (
          {
            content: Content,
            onClick,
            disabled,
            isSelected,
            style,
            className,
            type = "button",
            ...args
          },
          idx
        ) => {
          // If first render, and we're at the defaultSelectedIdx, call the onClick handler
          // TODO: Detect if first render of React after page updates
          if (refRenderIdx.current === 0 && selectedIdx === idx) {
            // Fixes issue:  Cannot update a component (`X`) while rendering a
            // different component (`Y`).
            setTimeout(() => {
              onClick();
            });
          }

          return (
            <button
              {...args}
              key={idx}
              type={type}
              onClick={() => {
                setSelectedIdx(idx);

                onClick();
              }}
              disabled={disabled}
              style={style}
              className={classNames([
                selectedIdx === idx && "active",
                className,
              ])}
            >
              {
                // TODO: Refactor
                typeof Content === "string" ? (
                  Content
                ) : typeof Content === "function" ? (
                  <Content />
                ) : (
                  { Content }
                )
              }
            </button>
          );
        }
      )}
    </div>
  );
}
