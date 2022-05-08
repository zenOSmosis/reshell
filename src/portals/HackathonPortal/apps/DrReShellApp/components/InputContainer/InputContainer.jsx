import { useCallback, useRef, useState } from "react";
import InputWithCustomCaret from "../InputWithCustomCaret";

import useKeyboardEvents from "@hooks/useKeyboardEvents";
import useWindowInputFocusLock from "@hooks/useWindowInputFocusLock";

// TODO: Rename
export default function InputContainer({
  initialValue,
  value,
  onChange,
  onSubmit,
  ...rest
}) {
  const [activeInput, setActiveInput] = useState(null);

  useWindowInputFocusLock(activeInput);

  const refInitialValue = useRef(initialValue);

  const [inputValue, setInputValue] = useState(initialValue);

  useKeyboardEvents(activeInput, {
    onEnter: () => {
      if (typeof onChange === "function") {
        onChange(activeInput.value);
      }

      if (typeof onSubmit === "function") {
        onSubmit(activeInput.value);
      }
    },
    onEscape: () => setInputValue(refInitialValue.current),
  });

  const handleChange = useCallback(
    evt => {
      const nextValue = evt.target.value;

      setInputValue(nextValue);

      if (typeof onChange === "function") {
        onChange(nextValue);
      }
    },
    [onChange]
  );

  // TODO: Show other lines
  return (
    <InputWithCustomCaret
      ref={setActiveInput}
      {...rest}
      // TODO: Truncate to active input
      value={inputValue}
      onChange={handleChange}
    />
  );
}
