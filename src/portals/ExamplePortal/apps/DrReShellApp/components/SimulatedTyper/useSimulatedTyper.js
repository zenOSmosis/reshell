import { consume } from "phantom-core";
import { useEffect, useState } from "react";

// TODO: Simulate optional variable-rate WPM
// TODO: Simulate optional typos(?)
export default function useSimulatedTyper({ text, onEnd }) {
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

      return;
    }

    const lenOutputText = outputText.length;
    // const lenText = text.length;

    const next = outputText + text[lenOutputText];

    const to = window.setTimeout(() => {
      setOutputText(next);
    }, 100);

    return () => window.clearTimeout(to);
  }, [text, outputText, onEnd]);

  return {
    outputText,
  };
}
