import { useCallback, useRef, useState } from "react";
import InputWithCustomCaret from "../InputWithCustomCaret";

import useKeyboardEvents from "@hooks/useKeyboardEvents";
import useWindowInputFocusLock from "@hooks/useWindowInputFocusLock";
import useAudio from "@hooks/useAudio";

import keySound from "../../sounds/zNBy-key4.mp3";

/**
 * Wraps InputWithCustomCaret with controller logic.
 */
export default function InputContainer({
  initialValue,
  value,
  onChange,
  onSubmit,
  ...rest
}) {
  const [activeInput, setActiveInput] = useState(null);

  // Give active input focus whenever its active ReShell window is in focus
  useWindowInputFocusLock(activeInput);

  const refInitialValue = useRef(initialValue);

  const [inputValue, setInputValue] = useState(initialValue);

  const keyboardAudio = useAudio(keySound);

  useKeyboardEvents(activeInput, {
    onKeyDown: keyboardAudio.play,
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

  if (!keyboardAudio.isPreloaded) {
    return null;
  }

  // FIXME: (jh) Implement optional multi-line handling
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
