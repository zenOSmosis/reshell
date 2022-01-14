import NoNetwork from "./views/NoNetwork";
import Layout, { Header, Content } from "@components/Layout";
import Padding from "@components/Padding";
import ChatView from "./views/ChatView";
import AppLinkButton from "@components/AppLinkButton";

import { REGISTRATION_ID as CALL_PLAYER_REGISTRATION_ID } from "@portals/SpeakerAppPortal/apps/CallPlayer";

import SpeakerAppClientZenRTCPeerService from "@portals/SpeakerAppPortal/services/SpeakerAppClientZenRTCPeerService";
import SpeakerAppClientPhantomSessionService from "@portals/SpeakerAppPortal/services/SpeakerAppClientPhantomSessionService";

export const REGISTRATION_ID = "chat";

const Chat = {
  id: REGISTRATION_ID,
  title: "Ephemeral Chat",
  style: {
    width: 640,
    height: 680,
  },
  serviceClasses: [
    SpeakerAppClientZenRTCPeerService,
    SpeakerAppClientPhantomSessionService,
  ],
  view: function View({ appServices }) {
    const zenRTCPeerService = appServices[SpeakerAppClientZenRTCPeerService];
    const phantomSessionService =
      appServices[SpeakerAppClientPhantomSessionService];

    const chatMessages = phantomSessionService.getChatMessages();

    const localPhantomPeer = phantomSessionService.getLocalPhantomPeer();

    const remotePhantomPeers = phantomSessionService.getRemotePhantomPeers();

    const currentlyTypingPhantomPeers = remotePhantomPeers.filter(peer =>
      peer.getIsTypingChatMessage()
    );

    // All PhantomPeer instances (local & remote)
    const phantomPeers = [localPhantomPeer, ...remotePhantomPeers];

    // TODO: Show network detail

    return (
      <Layout>
        <Header>
          <Padding>
            <AppLinkButton id={CALL_PLAYER_REGISTRATION_ID} title="Network" />
          </Padding>
        </Header>
        <Content>
          {!zenRTCPeerService.getIsConnected() ? (
            <NoNetwork />
          ) : (
            <ChatView
              phantomPeers={phantomPeers}
              currentlyTypingPhantomPeers={currentlyTypingPhantomPeers}
              chatMessages={chatMessages}
              onIsTypingChange={phantomSessionService.setIsTypingChatMessage}
              onMessageSend={phantomSessionService.sendChatMessage}
            />
          )}
        </Content>
      </Layout>
    );
  },
};

export default Chat;
