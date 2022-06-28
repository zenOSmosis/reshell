import { useCallback } from "react";
import Cover from "@components/Cover";
import AudioBorderAvatar from "@components/audioMeters/AudioBorderAvatar";
import LoadingSpinner from "@components/LoadingSpinner";
import ColoredSpeakerAudioLevelMeter from "@components/audioMeters/ColoredSpeakerAudioLevelMeter/ColoredSpeakerAudioLevelMeter";
import ContentButton from "@components/ContentButton";
import { Row, Column } from "@components/Layout";
import Avatar from "@components/Avatar";
import Padding from "@components/Padding";
import AudioLevelMeter from "@components/audioMeters/AudioLevelMeter";

// TODO: Document
// TODO: Add prop-types
export default function Participant({
  phantomPeer,
  isLocalPeer = false,
  onClick,
}) {
  const handleClick = useCallback(() => {
    if (typeof onClick === "function") {
      onClick(phantomPeer);
    }
  }, [onClick, phantomPeer]);

  const deviceAddress = phantomPeer.getDeviceAddress();
  const avatarURL = phantomPeer.getAvatarURL();
  const profileName = phantomPeer.getProfileName();
  const profileDescription = phantomPeer.getProfileDescription();
  const isAudioMuted = phantomPeer.getIsAudioMuted();

  // FIXME: "Outgoing" is in relation to the peer and is entirely confusing
  const outgoingAudioMediaStreamTracks =
    phantomPeer.getOutgoingAudioMediaStreamTracks();
  const outgoingVideoMediaStreamTracks =
    phantomPeer.getOutgoingVideoMediaStreamTracks();

  if (!deviceAddress) {
    return (
      <div style={{ textAlign: "center" }}>
        <LoadingSpinner />
        <div style={{ fontWeight: "bold", margin: 8 }}>
          New user connecting...
        </div>
      </div>
    );
  }

  return (
    <ContentButton onClick={handleClick}>
      <Padding>
        <Row disableVerticalFill>
          <Column disableHorizontalFill>
            <Avatar src={avatarURL} size={50} />
          </Column>
          <Column>
            <Padding style={{ paddingTop: 0, paddingBottom: 0 }}>
              <div style={{ fontWeight: "bold" }}>{profileName}</div>
              <div>
                {isLocalPeer && (
                  <span className="note" style={{ fontSize: ".8rem" }}>
                    (You)
                  </span>
                )}
              </div>
            </Padding>
          </Column>
          <Column disableHorizontalFill>
            <AudioLevelMeter
              mediaStreamTracks={outgoingAudioMediaStreamTracks}
            />
          </Column>
        </Row>
      </Padding>
    </ContentButton>
  );

  /*
  return (
    <ContentButton
      onClick={onOpenChat}
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
        <div style={{ fontWeight: "bold", textAlign: "center", marginTop: 4 }}>
          {profileName}
        </div>
      </div>
      {profileDescription}

      <div style={{ position: "absolute", bottom: 4, right: 4 }}>
        A: {outgoingAudioMediaStreamTracks.length} / V:{" "}
        {outgoingVideoMediaStreamTracks.length}{" "}
        {isAudioMuted ? "muted" : "unmuted"}
      </div>

      <Cover>
        <ColoredSpeakerAudioLevelMeter
          mediaStreamTracks={outgoingAudioMediaStreamTracks}
          style={{ position: "absolute", bottom: 20, right: 0, opacity: 0.4 }}
        />
      </Cover>
    </ContentButton>
  );
  */
}
