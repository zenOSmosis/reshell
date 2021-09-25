import Center from "@components/Center";
import SocketIOService from "@services/SocketIOService";

// TODO: Look into https://rclone.org for server-side mount-points with
// third-party storage providers

const Files = {
  id: "files",
  title: "Files",
  style: {
    left: 10,
    top: 10,
    width: 640,
    height: 480,
  },
  serviceClasses: [SocketIOService],
  view: function View({ windowController, windowServices }) {
    const socketService = windowServices[SocketIOService];

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
