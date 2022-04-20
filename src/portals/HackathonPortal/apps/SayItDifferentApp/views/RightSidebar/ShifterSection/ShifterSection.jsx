import { useCallback, useEffect, useRef, useState } from "react";

import Section from "@components/Section";
import Padding from "@components/Padding";

export default function ShifterSection({ posAnalyzer, text, onTextUpdate }) {
  const [isFetching, setIsFetching] = useState(false);

  const [hasAdditional, setHasAdditional] = useState(false);
  const refHasAdditional = useRef(hasAdditional);
  refHasAdditional.current = hasAdditional;

  useEffect(() => {
    if (!refHasAdditional.current) {
      setHasAdditional(true);
    }
  }, [text]);

  const handleFetchRandomizedTemplate = useCallback(async () => {
    setIsFetching(true);

    posAnalyzer
      .fetchRandomizedTemplate(text)
      .then(nextText => {
        if (nextText === text) {
          setHasAdditional(false);
        } else {
          onTextUpdate(nextText);
        }
      })
      .finally(() => setIsFetching(false));
  }, [posAnalyzer, text, onTextUpdate]);

  return (
    <Section>
      <h1>Shifter</h1>
      <p className="note">
        Shifter analyzes the sentence structure of your text and generates new
        sentences based on the same structure.
      </p>
      <Padding style={{ textAlign: "center" }}>
        <button
          disabled={!text || !hasAdditional || isFetching}
          onClick={handleFetchRandomizedTemplate}
        >
          Shift It
        </button>
      </Padding>
    </Section>
  );
}
