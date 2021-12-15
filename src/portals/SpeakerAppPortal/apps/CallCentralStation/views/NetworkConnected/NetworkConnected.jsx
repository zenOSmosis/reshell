import { useEffect, useState } from "react";

import Center from "@components/Center";
import Avatar from "@components/Avatar";
import StaggeredWaveLoading from "@components/StaggeredWaveLoading";

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

        return (
          <div
            key={deviceAddress}
            style={{
              display: "inline-block",
              width: 150,
              height: 150,
              border: "1px #ccc solid",
              overflow: "hidden",
            }}
          >
            {!deviceAddress ? (
              <StaggeredWaveLoading />
            ) : (
              <Center>
                <div>
                  {
                    // TODO: Use AudioMediaStreamTrackLevelAvatar instead (or equivalent)
                  }
                  <Avatar src={avatarURL} />
                </div>
                <div>{profileName}</div>
              </Center>
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
