import Center from "@components/Center";

export default function NetworkConnected({ remotePhantomPeers = [] }) {
  // TODO: If no remote peers, show a notice

  return (
    <Center>
      {remotePhantomPeers.map(phantomPeer => {
        const { deviceAddress } = phantomPeer.getState();

        // TODO: If no device address, show loading indicator

        return (
          <div
            key={deviceAddress}
            style={{
              display: "inline-block",
              width: 320,
              height: 320,
              border: "1px #ccc solid",
            }}
          >
            {deviceAddress}
          </div>
        );
      })}
    </Center>
  );
}
