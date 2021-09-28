import Center from "@components/Center";
import SocketIOService from "@services/SocketIOService";

// TODO: Look into https://rclone.org for server-side mount-points with
// third-party storage providers

// TODO: Save As view: https://developer.apple.com/design/human-interface-guidelines/macos/buttons/disclosure-controls/

const Files = {
  id: "files",
  title: "Files",
  style: {
    width: 640,
    height: 480,
  },
  serviceClasses: [SocketIOService],
  view: function View({ windowController, appServices }) {
    const socketService = appServices[SocketIOService];

    // TODO: Build out
    return (
      <Center>
        {" "}
        <button
          onClick={() => {
            socketService.createSocketChannel().then(socketChannel => {
              socketChannel.write("TESTING 1 2 3");
            });
          }}
        >
          Emit test hello
        </button>
      </Center>
    );
  },
};

export default Files;
