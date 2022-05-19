import Caret from "../Caret";
import PropTypes from "prop-types";

import useSimulatedTyper from "./useSimulatedTyper";

SimulatedTyper.propTypes = {
  text: PropTypes.string.isRequired,
  onTypingStart: PropTypes.func,
  onTypingEnd: PropTypes.func,
};

/**
 * Simulates a slow typing effect for computer-generated responses.
 */
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
