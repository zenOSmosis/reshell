import React, { useState, useCallback } from "react";
import Caret from "../Caret";

import classNames from "classnames";
import styles from "./InputWithCustomCaret.module.css";

import PropTypes from "prop-types";

/**
 * An HTML text input w/ a custom input.
 */
const InputWithCustomCaret = React.forwardRef(
  ({ onChange, onKeyDown, value, ...rest }, refInput) => {
    const [caretPosition, setCaretPosition] = useState(value?.length || 0);

    const handleChange = useCallback(
      evt => {
        setCaretPosition(evt.target.selectionStart);

        if (typeof onChange === "function") {
          onChange(evt);
        }
      },
      [onChange]
    );

    const handleKeyDown = useCallback(
      evt => {
        setCaretPosition(evt.target.selectionStart);

        if (typeof onKeyDown === "function") {
          onKeyDown(evt);
        }
      },
      [onKeyDown]
    );

    return (
      <div
        className={classNames(
          styles["input-with-custom-caret"],
          styles["wrapper"]
        )}
      >
        <input
          ref={refInput}
          className={styles["input-with-custom-caret"]}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={value}
          {...rest}
        />

        <div
          className={styles["caret-wrapper"]}
          style={{
            // TODO: Fix issue w/ Safari where this is not correct
            //
            // TODO: This might work better if hiding the actual input,
            // rendering the text state, and concatenating the caret on the
            // end
            left: caretPosition / 2.5 + "em",
            top: 0,
          }}
        >
          <Caret hPosition={caretPosition} />
        </div>
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
