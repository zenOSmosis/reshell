import React, { useState, useCallback } from "react";
import Caret from "../Caret";

// TODO: Document and add prop-types
const InputWithCustomCaret = React.forwardRef(
  ({ onChange, onKeyDown, value, ...rest }, refInput) => {
    const [caretPosition, setCaretPosition] = useState(value?.length || 0);

    // TODO: Document
    const handleChange = useCallback(
      evt => {
        setCaretPosition(evt.target.selectionStart);

        if (typeof onChange === "function") {
          onChange(evt);
        }
      },
      [onChange]
    );

    // TODO: Document
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
      // TODO: Use module styling
      <div style={{ position: "relative" }}>
        <input
          ref={refInput}
          style={{ caretColor: "transparent" }}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={value}
          {...rest}
        />

        <div
          style={{
            position: "absolute",
            // FIXME: Fix issue w/ Safari where this is not correct
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
