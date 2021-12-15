import Center from "@components/Center";
import Avatar from "@components/Avatar";

export default function NetworkConnected({ remotePhantomPeers = [] }) {
  // TODO: If no remote peers, show a notice

  return (
    <Center canOverflow={true}>
      {remotePhantomPeers.map(phantomPeer => {
        const deviceAddress = phantomPeer.getDeviceAddress();
        const avatarURL = phantomPeer.getAvatarURL();
        const profileName = phantomPeer.getProfileName();

        // TODO: If no device address, show loading indicator

        return (
          <div
            key={deviceAddress}
            style={{
              display: "inline-block",
              width: 150,
              height: 150,
              border: "1px #ccc solid",
            }}
          >
            <Center>
              <div>
                <Avatar src={avatarURL} />
              </div>
              <div>{profileName}</div>
            </Center>
          </div>
        );
      })}
    </Center>
  );
}
