import { useEffect, useState } from "react";
import Xterm from "@components/Xterm";
import SocketIOService from "../HostBridge/services/SocketIOService";

import { EVT_DESTROYED } from "phantom-core";

const Terminal = {
  id: "terminal",
  title: "Terminal",
  style: {
    left: "auto",
    bottom: 0,
    width: 640,
    height: 480,
  },
  serviceClasses: [SocketIOService],
  view: function View({ windowServices, setResizeHandler }) {
    const socketService = windowServices[SocketIOService];
    const [xterm, setXterm] = useState(null);

    const [socketChannel, setSocketChannel] = useState(null);

    // Refit Xterm when window resizes
    setResizeHandler(() => xterm && xterm.fit());

    // TODO: Refactor
    useEffect(() => {
      if (xterm) {
        socketService
          .createSocketChannel({ type: "terminal" })
          .then((socketChannel) => {
            socketChannel.on("data", (data) => xterm.write(data));

            setSocketChannel(socketChannel);

            socketChannel.once(EVT_DESTROYED, () => {
              xterm.writeln("");
              xterm.writeln("[Socket channel has been closed]");

              // TODO: Do additional work to signify to user this terminal
              // session has been disconnected and is not resumable
            });
          });
      }
    }, [xterm, socketService]);

    // Destruct socketChannel on unmount
    useEffect(() => {
      if (socketChannel) {
        return () => {
          socketChannel.destroy();
        };
      }
    }, [socketChannel]);

    return (
      <Xterm
        ref={setXterm}
        onInput={(data) => socketChannel && socketChannel.write(data)}
      />
    );
  },
};

export default Terminal;
