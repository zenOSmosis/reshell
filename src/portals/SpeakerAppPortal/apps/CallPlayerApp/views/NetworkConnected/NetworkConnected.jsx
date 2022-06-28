import { useEffect, useState } from "react";
import { Row, Column } from "@components/Layout";

import Center from "@components/Center";
import LoadingSpinner from "@components/LoadingSpinner";

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

  /*
  if (!remotePhantomPeers.length) {
    return (
      <Center>
        <div style={{ fontWeight: "bold" }}>
          {!isInSync ? (
            <div>
              <div style={{ marginBottom: 20 }}>
                <LoadingSpinner />
              </div>
              <div>Performing initial sync...</div>
            </div>
          ) : (
            "No remote peers are connected. You are the only one here."
          )}
        </div>
      </Center>
    );
  }
  */

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
      <Column style={{ backgroundColor: "rgba(0,0,0,.5)" }}>
        <Center canOverflow>
          {selectedPhantomPeer?.getProfileDescription()}
        </Center>
      </Column>
    </Row>
  );

  /*
  return (

  );
  */
}
