import { consume } from "phantom-core";
import { useEffect, useState } from "react";

// TODO: Document
function calcWPMTimeout(wpm) {
  const avgWordLength = 4.7;

  const lettersPerMinute = wpm * avgWordLength;

  const lettersPerSecond = lettersPerMinute / 60;

  return 1000 / lettersPerSecond;
}

// TODO: Simulate optional variable-rate WPM
// TODO: Simulate optional typos(?)
export default function useSimulatedTyper({ text, onEnd, wpm = 140 }) {
  const [isTyping, setIsTyping] = useState(true);

  const [outputText, setOutputText] = useState("");

  // Reset output text when text changes
  useEffect(() => {
    consume(text);

    setOutputText("");
  }, [text]);

  useEffect(() => {
    if (text === outputText) {
      if (typeof onEnd === "function") {
        window.setTimeout(onEnd, 100);
      }

      setIsTyping(false);

      return;
    }

    if (!isTyping) {
      setIsTyping(true);
    }

    const lenOutputText = outputText.length;

    const next = outputText + text[lenOutputText];

    const to = window.setTimeout(() => {
      setOutputText(next);
    }, calcWPMTimeout(wpm));

    return () => window.clearTimeout(to);
  }, [text, outputText, isTyping, onEnd, wpm]);

  return {
    outputText,
    isTyping,
  };
}
