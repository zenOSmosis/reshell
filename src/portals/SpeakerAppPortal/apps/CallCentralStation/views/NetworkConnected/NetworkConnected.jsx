import { useEffect, useState } from "react";

import Center from "@components/Center";
import StaggeredWaveLoading from "@components/StaggeredWaveLoading";
import AudioLevelMeter from "@components/audioMeters/AudioLevelMeter";
import AudioBorderAvatar from "@components/audioMeters/AudioBorderAvatar";
import Layout, { Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";

export default function NetworkConnected({ remotePhantomPeers = [] }) {
  const isInSync = useFakeIsInSync();

  if (!remotePhantomPeers.length) {
    return (
      <Center>
        {!isInSync
          ? "Awaiting initial peer sync..."
          : "No remote peers are connected."}
      </Center>
    );
  }

  return (
    <Center canOverflow={true}>
      {remotePhantomPeers.map(phantomPeer => {
        const deviceAddress = phantomPeer.getDeviceAddress();
        const avatarURL = phantomPeer.getAvatarURL();
        const profileName = phantomPeer.getProfileName();
        const profileDescription = phantomPeer.getProfileDescription();
        const outgoingMediaStreamTracks =
          phantomPeer.getOutgoingMediaStreamTracks();

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
                        mediaStreamTracks={outgoingMediaStreamTracks.filter(
                          ({ kind }) => kind === "audio"
                        )}
                      />
                    </div>
                    <div style={{ marginTop: 10, fontWeight: "bold" }}>
                      {profileName}
                    </div>
                  </Center>
                </Content>
                <Footer style={{ textAlign: "right", height: 60 }}>
                  <Padding>
                    {outgoingMediaStreamTracks
                      .filter(
                        mediaStreamTrack => mediaStreamTrack.kind === "audio"
                      )
                      .map(mediaStreamTrack => (
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
