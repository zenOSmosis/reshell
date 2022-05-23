import { useEffect, useState } from "react";

import Center from "@components/Center";
import LoadingSpinner from "@components/LoadingSpinner";

import ParticipantList from "./ParticipantList";

import { Video } from "@components/audioVideoRenderers";

// TODO: Document and add prop-types
export default function NetworkConnected({
  remotePhantomPeers = [],
  latestOutputVideoTrack,
}) {
  const isInSync = useFakeIsInSync();

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

  // TODO: Refactor; make transitioning more graceful
  if (latestOutputVideoTrack) {
    return <Video mediaStreamTrack={latestOutputVideoTrack} />;
  }

  return <ParticipantList remotePhantomPeers={remotePhantomPeers} />;
}

/**
 * Mocks in-sync state since ZenRTCPeer does not maintain a state of whether it
 * is in sync.
 *
 * @return {boolean}
 */
function useFakeIsInSync() {
  const [isInSync, setIsInSync] = useState(false);
  useEffect(() => {
    const to = window.setTimeout(() => setIsInSync(true), 1500);

    return function unmount() {
      window.clearTimeout(to);
    };
  }, []);

  return isInSync;
}
