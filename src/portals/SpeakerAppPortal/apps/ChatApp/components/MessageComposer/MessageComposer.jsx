import { useCallback, useState } from "react";
import { Row, Column } from "@components/Layout";

import PropTypes from "prop-types";

import useLocalChatMessageState from "./useLocalChatMessageState";

import useKeyboardEvents from "@hooks/useKeyboardEvents";

MessageComposer.propTypes = {
  /** Called when typing state changes. */
  onIsTypingChange: PropTypes.func.isRequired,

  /**
   * Called when message is sending.
   *
   * If a promise is used, the component will wait for the promise to resolve
   * before updating state.
   **/
  onSend: PropTypes.func.isRequired,

  /** Placeholder text for input field. */
  placeholder: PropTypes.string,
};

export default function MessageComposer({
  onIsTypingChange,
  onSend,
  placeholder = "What do you want to say?",
}) {
  const [elInput, setElInput] = useState(null);

  const {
    localChatMessage,
    createNewLocalChatMessageState,
    registerTypingIndication,
  } = useLocalChatMessageState(onIsTypingChange);
  const [isSending, setIsSending] = useState(false);

  const body = localChatMessage.getBody();
  const canSend = !isSending && Boolean(body);

  /**
   * @return {Promise<void>}
   */
  const handleSend = useCallback(async () => {
    if (!canSend) {
      return;
    }

    setIsSending(true);

    try {
      await onSend(localChatMessage.getPublishableState());

      // Reset message
      createNewLocalChatMessageState();
    } catch (err) {
      console.error(err);

      // NOTE: Error handler is intentionally not specified here because it
      // should be handled upstream in the onSend handler
    } finally {
      setIsSending(false);
    }
  }, [onSend, localChatMessage, canSend, createNewLocalChatMessageState]);

  useKeyboardEvents(elInput, {
    onKeyDown: () => registerTypingIndication(),
    onEnter: () => handleSend(),
    onEscape: () => localChatMessage.resetBody(),
  });

  // TODO: Make CSS module
  return (
    <div>
      <div className="note" style={{ marginBottom: 2 }}>
        {body.length} character{body.length !== 1 && "s"} used.{" "}
        {isSending && <span style={{ color: "yellow" }}>Sending...</span>}
      </div>
      <Row>
        <Column>
          {
            // TODO: Implement max-length?
            // TODO: Auto-focus if not on mobile
          }
          <input
            ref={setElInput}
            type="text"
            placeholder={placeholder}
            value={body}
            onChange={evt => localChatMessage.setBody(evt.target.value)}
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            readOnly={isSending}
          />
        </Column>
        <Column
          style={{
            maxWidth: 50,
          }}
        >
          <button
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            disabled={!canSend}
            onClick={handleSend}
          >
            Send
          </button>
        </Column>
      </Row>
    </div>
  );
}
