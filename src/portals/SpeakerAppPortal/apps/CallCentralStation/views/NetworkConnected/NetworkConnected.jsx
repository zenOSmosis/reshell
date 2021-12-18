import { useEffect, useState } from "react";

import Center from "@components/Center";
import StaggeredWaveLoading from "@components/StaggeredWaveLoading";
import AudioLevelMeter from "@components/audioMeters/AudioLevelMeter";
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
          {!isInSync
            ? "Awaiting initial peer sync..."
            : "No remote peers are connected. You are the only one here."}
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
      {remotePhantomPeers.map(phantomPeer => {
        const deviceAddress = phantomPeer.getDeviceAddress();
        const avatarURL = phantomPeer.getAvatarURL();
        const profileName = phantomPeer.getProfileName();
        const profileDescription = phantomPeer.getProfileDescription();
        const outgoingAudioMediaStreamTracks =
          phantomPeer.getOutgoingAudioMediaStreamTracks();

        return (
          <div
            key={deviceAddress}
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
              <StaggeredWaveLoading />
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
                <Footer style={{ textAlign: "right", height: 60 }}>
                  <Padding>
                    {outgoingAudioMediaStreamTracks.map(mediaStreamTrack => (
                      <AudioLevelMeter
                        key={mediaStreamTrack.id}
                        mediaStreamTrack={mediaStreamTrack}
                        style={{ height: "100%" }}
                      />
                    ))}
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
    const to = setTimeout(() => setIsInSync(true), 1500);

    return function unmount() {
      clearTimeout(to);
    };
  }, []);

  return isInSync;
}
