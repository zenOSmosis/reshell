import { useEffect, useState } from "react";
import Layout, { Header, Content, Row, Column } from "@components/Layout";
import Center from "@components/Center";
import Cover from "@components/Cover";
import Padding from "@components/Padding";
import Ellipses from "@components/Ellipses";
import Avatar from "@components/Avatar";

import ParticipantList from "./ParticipantList";

// TODO: Document and add prop-types
export default function NetworkConnected({
  onOpenChat,
  localPhantomPeer,
  remotePhantomPeers = [],
}) {
  const [selectedPhantomPeer, setSelectedPhantomPeer] =
    useState(localPhantomPeer);

  // Automatically deselect disconnected peers
  useEffect(() => {
    if (
      selectedPhantomPeer === null ||
      selectedPhantomPeer === localPhantomPeer
    ) {
      return;
    } else if (!remotePhantomPeers.includes(selectedPhantomPeer)) {
      setSelectedPhantomPeer(null);
    }
  }, [localPhantomPeer, remotePhantomPeers, selectedPhantomPeer]);

  return (
    <Row>
      <Column disableHorizontalFill style={{ width: 280 }}>
        <ParticipantList
          localPhantomPeer={localPhantomPeer}
          remotePhantomPeers={remotePhantomPeers}
          onClick={setSelectedPhantomPeer}
          selectedPhantomPeer={selectedPhantomPeer}
        />
      </Column>
      {
        // TODO: Only show this column if wide enough to show
      }
      <Column style={{ backgroundColor: "rgba(0,0,0,.3)" }}>
        <Cover>
          <Avatar
            src={selectedPhantomPeer?.getAvatarURL()}
            style={{
              position: "absolute",
              right: 10,
              bottom: 10,
              opacity: 0.5,
            }}
            size={100}
          />
        </Cover>
        <Cover>
          <Padding>
            <Layout>
              <Header>
                <Row disableVerticalFill>
                  <Column>
                    <h1>
                      <Ellipses>
                        {selectedPhantomPeer?.getProfileName()}
                      </Ellipses>
                    </h1>
                  </Column>
                  <Column disableHorizontalFill>
                    <button onClick={onOpenChat}>Chat</button>
                  </Column>
                </Row>
              </Header>
              <Content>
                <Center canOverflow>
                  <div style={{ fontSize: "1.5rem" }}>
                    {selectedPhantomPeer?.getProfileDescription()}
                  </div>
                </Center>
              </Content>
            </Layout>
          </Padding>
        </Cover>
      </Column>
    </Row>
  );
}
