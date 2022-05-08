import Caret from "../Caret";

import useSimulatedTyper from "./useSimulatedTyper";

export default function SimulatedTyper({ text, onEnd }) {
  const { outputText, isTyping } = useSimulatedTyper({ text, onEnd });

  return (
    <div>
      <span>{outputText}</span>
      {isTyping && <Caret />}
    </div>
  );
}
