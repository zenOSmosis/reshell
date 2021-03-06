import { consume, sleep } from "phantom-core";
import { useEffect, useState } from "react";

import useAsyncEffect from "@hooks/useAsyncEffect";

/**
 * Determines the number of milliseconds between character presses to achieve
 * the desired words per minute.
 *
 * @param {number} wpm
 * @return {number}
 */
function calcWPMTimeout(wpm) {
  // Average English word length
  const avgWordLength = 4.7;

  const lettersPerMinute = wpm * avgWordLength;

  const lettersPerSecond = lettersPerMinute / 60;

  return 1000 / lettersPerSecond;
}

// TODO: Simulate optional variable-rate WPM
// TODO: Simulate optional typos(?)
export default function useSimulatedTyper({
  text,
  onTypingStart = null,
  onTypingEnd = null,
  wpm = 160,
  leadingEdgeTimeout = 1000,
}) {
  const [isTyping, setIsTyping] = useState(false);

  const [outputText, setOutputText] = useState("");

  // Reset output text when text changes
  useEffect(() => {
    consume(text);

    setOutputText("");
  }, [text]);

  // Handle automatic typing
  useAsyncEffect(
    async abortController => {
      // Determine if finished typing
      if (text === outputText) {
        setIsTyping(false);

        return;
      }

      const lenOutputText = outputText.length;

      if (!lenOutputText) {
        await sleep(leadingEdgeTimeout);
      }

      const next = outputText + text[lenOutputText];

      const to = window.setTimeout(() => {
        if (!abortController?.signal?.aborted) {
          if (!isTyping) {
            setIsTyping(true);
          }

          setOutputText(next);
        }
      }, calcWPMTimeout(wpm));

      return () => window.clearTimeout(to);
    },
    [text, outputText, isTyping, wpm, leadingEdgeTimeout]
  );

  // Handle onTypingStart detection
  useEffect(() => {
    if (isTyping && typeof onTypingStart === "function") {
      onTypingStart();
    }
  }, [onTypingStart, isTyping]);

  // Handle onTypingEnd detection
  //
  // Note: This isn't included in the previous useEffect to the the potential
  // of this being called more than necessary
  useEffect(() => {
    if (text === outputText && typeof onTypingEnd === "function") {
      onTypingEnd();
    }
  }, [text, outputText, onTypingEnd]);

  return {
    outputText,
    isTyping,
  };
}
