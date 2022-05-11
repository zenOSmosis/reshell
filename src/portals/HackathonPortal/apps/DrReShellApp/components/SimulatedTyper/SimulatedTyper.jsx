import Caret from "../Caret";

import useSimulatedTyper from "./useSimulatedTyper";

export default function SimulatedTyper({ text, onStart, onEnd }) {
  const { outputText } = useSimulatedTyper({ text, onStart, onEnd });

  return (
    <div>
      <span>{outputText}</span>
      <Caret />
    </div>
  );
}
