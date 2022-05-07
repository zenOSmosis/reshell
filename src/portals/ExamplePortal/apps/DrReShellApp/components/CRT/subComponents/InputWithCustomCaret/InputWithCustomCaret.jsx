import { useState, useCallback } from "react";
import Caret from "./Caret";

export default function InputWithCustomCaret({
  onChange,
  onKeyDown,
  value,
  ...rest
}) {
  const [caretPosition, setCaretPosition] = useState(value?.length || 0);

  // TODO: Handle and document
  const handleChange = useCallback(
    evt => {
      setCaretPosition(evt.target.selectionStart);

      if (typeof onChange === "function") {
        onChange(evt);
      }
    },
    [onChange]
  );

  // TODO: Handle and document
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
    <div style={{ position: "relative" }}>
      <input
        style={{ caretColor: "transparent" }}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={value}
        {...rest}
      />

      <Caret hPosition={caretPosition} />
    </div>
  );
}
