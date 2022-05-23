import { useCallback, useEffect, useState } from "react";

import LocalChatMessageState, { EVT_UPDATE } from "./LocalChatMessageState";

import useForceUpdate from "@hooks/useForceUpdate";

/**
 * Manages per-chat-message lifecycle state.
 *
 * @param {function<boolean>} onIsTypingChange
 * @return {Object} // TODO: Document structure
 */
export default function useLocalChatMessageState(onIsTypingChange) {
  const [localChatMessage, setLocalChatMessageState] = useState(
    new LocalChatMessageState()
  );

  const forceUpdate = useForceUpdate();

  // Force component to re-render on state changes
  useEffect(() => {
    if (localChatMessage) {
      let isTyping = false;

      const _handleUpdate = () => {
        if (isTyping !== localChatMessage.getIsTyping()) {
          isTyping = !isTyping;

          onIsTypingChange(isTyping);
        }

        forceUpdate();
      };

      localChatMessage.on(EVT_UPDATE, _handleUpdate);

      return () => {
        localChatMessage.off(EVT_UPDATE, _handleUpdate);
      };
    }
  }, [localChatMessage, forceUpdate, onIsTypingChange]);

  // Destruct current chat message when component unmounts
  useEffect(() => {
    if (localChatMessage) {
      return () => localChatMessage.destroy();
    }
  }, [localChatMessage]);

  const createNewLocalChatMessageState = useCallback(() => {
    const localChatMessage = new LocalChatMessageState();

    setLocalChatMessageState(localChatMessage);
  }, []);

  const registerTypingIndication = useCallback(() => {
    localChatMessage.setIsTyping(true);
  }, [localChatMessage]);

  return {
    localChatMessage,
    createNewLocalChatMessageState,
    registerTypingIndication,
  };
}
