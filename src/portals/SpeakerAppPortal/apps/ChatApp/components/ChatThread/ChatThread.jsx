import React, { useEffect, useState } from "react";
import Message from "./ChatThread.Message";
import Spacer from "./ChatThread.MessageSpacer";

import styles from "./ChatThread.module.css";

// TODO: Add prop-types
export default function ChatThread({ phantomPeers, chatMessages = [] }) {
  const [elScroller, setElScroller] = useState(null);

  // Force scroller to bottom when there are new chatMessages
  useEffect(() => {
    if (elScroller && chatMessages) {
      elScroller.scrollTop = elScroller.scrollHeight;
    }
  }, [elScroller, chatMessages]);

  return (
    <div ref={setElScroller} className={styles["chat-thread"]}>
      {chatMessages.map((chatMessage, idx) => {
        // FIXME: (jh) Move data aggregation upstream so that we can add UI notifications more easily?
        const phantomPeer = phantomPeers.find(
          pred => chatMessage.senderAddress === pred.getDeviceAddress()
        );

        const avatarSrc = phantomPeer?.getAvatarURL();
        const name = phantomPeer?.getProfileName();

        return (
          // FIXME: (jh) Using idx as key is not a good practice (as opposed to
          // chatMessage.id) however there are times that a chat message can be
          // duplicated and I don't yet want to reduce the chat messages to
          // visually have a clue how often that could be a problem (and
          // perhaps, I'm just lazy?)
          <React.Fragment key={idx}>
            <Spacer />

            <Message
              avatarSrc={avatarSrc}
              name={name}
              body={chatMessage.body}
              dateSent={chatMessage.createDate}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
