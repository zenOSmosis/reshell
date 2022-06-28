import Scrollable from "@components/Scrollable";

import Participant from "./Participant";

// TODO: Document
// TODO: Add prop-types
export default function ParticipantList({
  localPhantomPeer,
  remotePhantomPeers,
  selectedPhantomPeer,
  onClick,
}) {
  return (
    <Scrollable>
      <ul>
        <li
          className={selectedPhantomPeer === localPhantomPeer ? "selected" : ""}
        >
          <Participant
            phantomPeer={localPhantomPeer}
            isLocalPeer={true}
            onClick={onClick}
          />
        </li>
        {[...remotePhantomPeers].reverse().map((phantomPeer, idx) => (
          <li className={selectedPhantomPeer === phantomPeer ? "selected" : ""}>
            <Participant
              key={idx}
              phantomPeer={phantomPeer}
              onClick={onClick}
            />
          </li>
        ))}
      </ul>
    </Scrollable>
  );
}
