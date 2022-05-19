import { useCallback, useState } from "react";
import InputWithCustomCaret from "../InputWithCustomCaret";

import useKeyboardEvents from "@hooks/useKeyboardEvents";
import useWindowInputFocusLock from "@hooks/useWindowInputFocusLock";
import useAudio from "@hooks/useAudio";

import keySound from "../../sounds/zNBy-key4.mp3";

import { INPUT_PROMPT } from "../../constants";

/**
 * Wraps InputWithCustomCaret with controller logic.
 */
export default function InputContainer({ onChange, onSubmit, ...rest }) {
  const [activeInput, setActiveInput] = useState(null);

  // Give active input focus whenever its active ReShell window is in focus
  useWindowInputFocusLock(activeInput);

  const [inputValue, setInputValue] = useState(INPUT_PROMPT);

  const keyboardAudio = useAudio(keySound);

  // Strips the input prompt from the given value
  const getFilteredValue = useCallback(
    value => value.replace(INPUT_PROMPT, ""),
    []
  );

  useKeyboardEvents(activeInput, {
    onKeyDown: keyboardAudio.play,
    onEnter: () => {
      if (typeof onChange === "function") {
        onChange(getFilteredValue(activeInput.value));
      }

      if (typeof onSubmit === "function") {
        onSubmit(getFilteredValue(activeInput.value));
      }
    },
    onEscape: () => setInputValue(INPUT_PROMPT),
  });

  const handleChange = useCallback(
    evt => {
      const nextValue = evt.target.value;

      if (!nextValue.startsWith(INPUT_PROMPT)) {
        return;
      }

      setInputValue(nextValue);

      if (typeof onChange === "function") {
        onChange(getFilteredValue(nextValue));
      }
    },
    [onChange, getFilteredValue]
  );

  if (!keyboardAudio.isPreloaded) {
    return null;
  }

  // FIXME: (jh) Implement optional multi-line handling
  return (
    <InputWithCustomCaret
      ref={setActiveInput}
      {...rest}
      value={inputValue}
      onChange={handleChange}
    />
  );
}
