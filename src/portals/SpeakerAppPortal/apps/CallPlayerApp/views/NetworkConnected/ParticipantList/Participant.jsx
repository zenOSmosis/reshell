import AudioBorderAvatar from "@components/audioMeters/AudioBorderAvatar";
import LoadingSpinner from "@components/LoadingSpinner";

// TODO: Document
// TODO: Add prop-types
export default function Participant({ phantomPeer }) {
  const deviceAddress = phantomPeer.getDeviceAddress();
  const avatarURL = phantomPeer.getAvatarURL();
  const profileName = phantomPeer.getProfileName();
  const profileDescription = phantomPeer.getProfileDescription();
  const outgoingAudioMediaStreamTracks =
    phantomPeer.getOutgoingAudioMediaStreamTracks();
  const outgoingVideoMediaStreamTracks =
    phantomPeer.getOutgoingVideoMediaStreamTracks();

  if (!deviceAddress) {
    return (
      <>
        <LoadingSpinner />
        New user connecting...
      </>
    );
  }

  return (
    <div
      style={{
        overflow: "auto",
        border: "1px #999 solid",
        backgroundColor: "rgba(0,0,0,.4)",
        padding: 4,
        margin: 4,
        borderRadius: 8,
        position: "relative",
      }}
    >
      <div style={{ float: "left", margin: 8 }}>
        <div>
          <AudioBorderAvatar
            src={avatarURL}
            mediaStreamTracks={outgoingAudioMediaStreamTracks}
            size={120}
          />
        </div>
        <div style={{ fontWeight: "bold" }}>{profileName}</div>
      </div>
      {profileDescription}
      <div style={{ position: "absolute", bottom: 4, right: 4 }}>
        A: {outgoingAudioMediaStreamTracks.length} / V:{" "}
        {outgoingVideoMediaStreamTracks.length}
      </div>
    </div>
  );
}
