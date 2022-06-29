import { useCallback } from "react";
import LoadingSpinner from "@components/LoadingSpinner";
import ContentButton from "@components/ContentButton";
import { Row, Column } from "@components/Layout";
import Avatar from "@components/Avatar";
import Padding from "@components/Padding";
import AudioLevelMeter from "@components/audioMeters/AudioLevelMeter";
import Ellipses from "@components/Ellipses";

import MicrophoneIcon from "@icons/MicrophoneIcon";

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
  /*
  const outgoingVideoMediaStreamTracks =
    phantomPeer.getOutgoingVideoMediaStreamTracks();
  */

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
    <ContentButton onClick={handleClick} title={profileDescription}>
      <Padding>
        <Row disableVerticalFill>
          <Column disableHorizontalFill>
            <Avatar src={avatarURL} size={50} />
          </Column>
          <Column>
            <Padding style={{ paddingTop: 0, paddingBottom: 0 }}>
              <div style={{ fontWeight: "bold" }}>{profileName}</div>
              <div>
                <Ellipses className="note" style={{ fontSize: ".8rem" }}>
                  {isLocalPeer && (
                    <>
                      <span>(You)</span>&nbsp;
                    </>
                  )}
                  {profileDescription}
                </Ellipses>
              </div>
              <div style={{ position: "absolute", right: 0, bottom: 0 }}>
                <span style={{ marginRight: ".5rem", fontSize: ".6rem" }}>
                  {isAudioMuted ? "Muted" : "Unmuted"}
                </span>
                <MicrophoneIcon
                  title={isAudioMuted ? "Muted" : "Unmuted"}
                  style={{ color: isAudioMuted ? "gray" : "white" }}
                />
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
}
