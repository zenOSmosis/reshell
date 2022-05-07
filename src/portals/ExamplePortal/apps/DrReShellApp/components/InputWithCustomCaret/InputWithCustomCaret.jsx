import { useState, useCallback, useEffect, useRef } from "react";
import Caret from "./Caret";

// TODO: Forward ref
// TODO: Document and add prop-types
export default function InputWithCustomCaret({
  onChange,
  onKeyDown,
  value,
  ...rest
}) {
  const refInput = useRef(null);

  useEffect(() => {
    if (refInput.current) {
      refInput.current.focus();
    }
  }, []);

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
        ref={refInput}
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
