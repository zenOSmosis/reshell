import { useEffect, useState } from "react";

import Center from "@components/Center";
import LoadingSpinner from "@components/LoadingSpinner";
import CanvasMicAudioMeter from "@components/audioMeters/CanvasMicAudioMeter";
import AudioBorderAvatar from "@components/audioMeters/AudioBorderAvatar";
import Layout, { Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";

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
              <div>Performing initial sync...</div>
              <div style={{ marginTop: 20 }}>
                <LoadingSpinner />
              </div>
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

  return (
    <Center canOverflow={true}>
      {remotePhantomPeers.map((phantomPeer, idx) => {
        const deviceAddress = phantomPeer.getDeviceAddress();
        const avatarURL = phantomPeer.getAvatarURL();
        const profileName = phantomPeer.getProfileName();
        const profileDescription = phantomPeer.getProfileDescription();
        const outgoingAudioMediaStreamTracks =
          phantomPeer.getOutgoingAudioMediaStreamTracks();

        const lenOutgoingAudioMediaStreamTracks =
          outgoingAudioMediaStreamTracks.length;

        return (
          <div
            key={idx}
            style={{
              display: "inline-block",
              width: 200,
              height: 200,
              border: "1px #ccc solid",
              backgroundColor: "rgba(255,255,255,.4)",
              color: "#000",
              borderRadius: 4,
              overflow: "hidden",
            }}
            title={profileDescription}
          >
            {!deviceAddress ? (
              <LoadingSpinner />
            ) : (
              <Layout>
                <Content>
                  <Center>
                    <div>
                      <AudioBorderAvatar
                        src={avatarURL}
                        mediaStreamTracks={outgoingAudioMediaStreamTracks}
                      />
                    </div>
                    <div style={{ marginTop: 10, fontWeight: "bold" }}>
                      {profileName}
                    </div>
                  </Center>
                </Content>
                <Footer style={{ textAlign: "right" }}>
                  <Padding>
                    {
                      // FIXME: Provide ability to show independent audio
                      // streams vs single (uses more CPU)
                    }
                    <div
                      title={`${lenOutgoingAudioMediaStreamTracks} audio stream${
                        lenOutgoingAudioMediaStreamTracks !== 1 ? "s" : ""
                      } received from ${profileName}`}
                    >
                      <CanvasMicAudioMeter
                        mediaStreamTracks={outgoingAudioMediaStreamTracks}
                        size={48}
                      />
                    </div>
                  </Padding>
                </Footer>
              </Layout>
            )}
          </div>
        );
      })}
    </Center>
  );
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
