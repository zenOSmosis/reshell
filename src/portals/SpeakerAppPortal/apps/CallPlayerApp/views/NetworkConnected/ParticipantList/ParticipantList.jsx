import Full from "@components/Full";

import Participant from "./Participant";

// TODO: Document
// TODO: Add prop-types
export default function ParticipantList({ remotePhantomPeers, onOpenChat }) {
  return (
    <Full style={{ overflowY: "auto" }}>
      {[...remotePhantomPeers].reverse().map((phantomPeer, idx) => (
        <Participant
          key={idx}
          phantomPeer={phantomPeer}
          onOpenChat={onOpenChat}
        />
      ))}
    </Full>
  );
}
