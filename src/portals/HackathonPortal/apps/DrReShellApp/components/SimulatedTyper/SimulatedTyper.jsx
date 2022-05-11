import Caret from "../Caret";

import useSimulatedTyper from "./useSimulatedTyper";

// TODO: Document
// TODO: Add prop-types
export default function SimulatedTyper({ text, onTypingStart, onTypingEnd }) {
  const { outputText } = useSimulatedTyper({
    text,
    onTypingStart,
    onTypingEnd,
  });

  return (
    <div>
      <span>{outputText}</span>
      <Caret />
    </div>
  );
}
