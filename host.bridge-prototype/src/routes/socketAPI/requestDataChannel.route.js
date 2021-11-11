import SocketChannel, { EVT_CONNECTED } from "@shared/SocketChannel";
import pty from "./pty";

// TODO: Document
export default function requestDataChannelRoute(socketAPI) {
  // TODO: Include potential authorization, channel type, etc
  // TODO: Use constant?
  socketAPI.addRoute("request-data-channel", ({ channelId, type }) => {
    const socket = socketAPI.getSocket();

    // TODO: Refactor
    const socketChannel = new SocketChannel(socket, channelId);

    // TODO: Remove?
    /*
    socketChannel.on(EVT_DATA, (data) => {
      console.log(
        `socketChannel "${socketChannel.getChannelId()}" received data`,
        data
      );
    });
    */

    // TODO: Remove?
    socketChannel.on(EVT_CONNECTED, () => {
      console.log("connected");

      // socketChannel.write("HELLO");

      // TODO: Refactor; Add security
      if (type === "terminal") {
        console.log("pty");
        pty(socketChannel);
      }
    });

    return {
      channelId: socketChannel.getChannelId(),
    };
  });
}
