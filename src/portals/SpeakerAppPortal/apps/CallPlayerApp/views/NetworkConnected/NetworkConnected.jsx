import { useEffect, useState } from "react";
import Layout, { Header, Content, Row, Column } from "@components/Layout";
import Center from "@components/Center";
import Cover from "@components/Cover";
import Padding from "@components/Padding";
import Ellipses from "@components/Ellipses";
import Avatar from "@components/Avatar";

import ParticipantList from "./ParticipantList";

import useWindowSize from "@hooks/useWindowSize";

const WIDE_LAYOUT_THRESHOLD_WIDTH = 512;

// TODO: Document and add prop-types
export default function NetworkConnected({
  onOpenChat,
  localPhantomPeer,
  remotePhantomPeers = [],
}) {
  const windowSize = useWindowSize();

  // TODO: Remove
  console.log({ windowSize });

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

  useEffect(() => {
    if (windowSize.width < WIDE_LAYOUT_THRESHOLD_WIDTH && selectedPhantomPeer) {
      setSelectedPhantomPeer(null);
    }
  }, [windowSize, selectedPhantomPeer]);

  return (
    <Row>
      <Column
        disableHorizontalFill
        style={{
          backgroundColor: "rgba(255,255,255,.1)",
          width: windowSize.width >= WIDE_LAYOUT_THRESHOLD_WIDTH ? 280 : "100%",
        }}
      >
        <ParticipantList
          localPhantomPeer={localPhantomPeer}
          remotePhantomPeers={remotePhantomPeers}
          onClick={setSelectedPhantomPeer}
          selectedPhantomPeer={selectedPhantomPeer}
        />
      </Column>

      {windowSize.width >= WIDE_LAYOUT_THRESHOLD_WIDTH && (
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
            {selectedPhantomPeer ? (
              <Padding>
                <Layout>
                  <Header>
                    <Row disableVerticalFill>
                      <Column>
                        <h1>
                          <Ellipses>
                            {selectedPhantomPeer.getProfileName()}
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
                        {selectedPhantomPeer.getProfileDescription()}
                      </div>
                    </Center>
                  </Content>
                </Layout>
              </Padding>
            ) : (
              <Center style={{ fontWeight: "bold" }}>
                Select a participant to view their profile
              </Center>
            )}
          </Cover>
        </Column>
      )}
    </Row>
  );
}
