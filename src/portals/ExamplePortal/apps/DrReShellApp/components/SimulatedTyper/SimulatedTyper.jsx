import useSimulatedTyper from "./useSimulatedTyper";

export default function SimulatedTyper({ text, onEnd }) {
  const { outputText } = useSimulatedTyper({ text, onEnd });

  return <div>{outputText}</div>;
}
