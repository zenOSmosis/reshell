import { useMemo } from "react";
import Full from "@components/Full";
import Center from "@components/Center";
import Padding from "@components/Padding";
import Layout, { Content, Footer } from "@components/Layout";

import ChatThread from "../../components/ChatThread";
import MessageComposer from "../../components/MessageComposer";

// TODO: Use Discord styling for guidance: https://support.discord.com/hc/en-us/community/posts/360055074172-Mini-Chats
// TODO: Add prop-types
export default function ChatView({
  phantomPeers,
  chatMessages,
  currentlyTypingPhantomPeers,
  onIsTypingChange,
  onMessageSend,
}) {
  const lenChatMessages = chatMessages.length;

  const lenUsersTyping = currentlyTypingPhantomPeers.length;

  // TODO: Refactor into another component
  /**
   * Nicely formatting text representation of current users typing.
   *
   * @type {string}
   */
  const usersTypingMessage = useMemo(() => {
    const namedUsersTyping = currentlyTypingPhantomPeers.map(peer =>
      peer.getProfileName()
    );

    if (!lenUsersTyping) {
      return "";
    }

    let ret = "";

    for (let i = 0; i < lenUsersTyping; i++) {
      ret += namedUsersTyping[i];

      if (lenUsersTyping === 1) {
        break;
      }

      if (i < lenUsersTyping - 2) {
        ret += ", ";
      } else if (i === lenUsersTyping - 2) {
        ret += " & ";
      }
    }

    ret += ` ${lenUsersTyping === 1 ? "is" : "are"} typing...`;

    return ret;
  }, [currentlyTypingPhantomPeers, lenUsersTyping]);

  return (
    <Full>
      <Padding>
        <Layout>
          <Content>
            {lenChatMessages ? (
              <ChatThread
                phantomPeers={phantomPeers}
                chatMessages={chatMessages}
              />
            ) : (
              <Center style={{ fontWeight: "bold" }}>
                There are currently no chat messages. Be the first to write one!
              </Center>
            )}
            {
              // TODO: Refactor into component / use CSS module
              lenUsersTyping && (
                <div
                  style={{
                    position: "absolute",
                    padding: 5,
                    color: "fff",
                    width: "100%",
                    bottom: 0,
                    fontStyle: "italic",
                    pointerEvents: "none",
                  }}
                >
                  {usersTypingMessage}
                </div>
              )
            }
          </Content>
          <Footer>
            <MessageComposer
              onIsTypingChange={onIsTypingChange}
              onSend={onMessageSend}
            />
          </Footer>
        </Layout>
      </Padding>
    </Full>
  );
}
