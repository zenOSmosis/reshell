import { useCallback, useRef, useState } from "react";

import Full from "@components/Full";
import Center from "@components/Center";

import SimulatedTyper from "../components/SimulatedTyper";

import useKeyboardEvents from "@root/src/hooks/useKeyboardEvents";

const LINES = [
  "DR. RESHELL",
  "COPYRIGHT (C) 1984 FAKE COMPANY.",
  "ALL RIGHTS RESERVED.",
  "",
  "TAP OR PRESS ANY KEY TO START",
];

export default function IntroView({ onEnd }) {
  const [idxLine, setIdxLine] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);

  const handleEnd = useCallback(() => {
    if (hasEnded && typeof onEnd === "function") {
      onEnd();
    }
  }, [hasEnded, onEnd]);

  // TODO: Enforce this to work w/ this window
  // TODO: Pass the window element as an optional property (OR grab from context)
  useKeyboardEvents(window, {
    onKeyDown: handleEnd,
  });

  return (
    <Full onMouseDown={handleEnd} onTouchStart={handleEnd}>
      <Center>
        {LINES.map((line, idx) => {
          if (idxLine === idx) {
            return (
              <SimulatedTyper
                key={idx}
                text={line}
                onEnd={() => {
                  if (idxLine < LINES.length - 1) {
                    setIdxLine(idx + 1);
                  } else {
                    setHasEnded(true);
                  }
                }}
              />
            );
          } else {
            return <div key={idx}>&nbsp;{idx <= idxLine && line}&nbsp;</div>;
          }
        })}
      </Center>
    </Full>
  );
}
