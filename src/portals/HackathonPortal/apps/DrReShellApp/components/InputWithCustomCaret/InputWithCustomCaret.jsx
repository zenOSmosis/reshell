import React from "react";
import Caret from "../Caret";

import classNames from "classnames";
import styles from "./InputWithCustomCaret.module.css";

import PropTypes from "prop-types";

/**
 * An HTML text input w/ a custom input.
 */
const InputWithCustomCaret = React.forwardRef(
  ({ onChange, onKeyDown, value, ...rest }, refInput) => {
    return (
      <div
        className={classNames(
          styles["input-with-custom-caret"],
          styles["wrapper"]
        )}
      >
        <div>
          <span>{value}</span>
          <Caret />
        </div>
        <input
          ref={refInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={value}
          {...rest}
        />
      </div>
    );
  }
);

export default InputWithCustomCaret;

InputWithCustomCaret.propTypes = {
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  value: PropTypes.string,
};
