import { useEffect, useState } from "react";
import Xterm from "@components/Xterm";
import SocketIOService from "@services/SocketIOService";

import { EVT_DESTROYED } from "phantom-core";

/**
 * Also see:
 * - Custom Linux VM running in a browser: https://twitter.com/humphd/status/1121075799539486720
 * -  https://humphd.github.io/browser-shell https://github.com/humphd/browser-shell
 */

const TerminalApp = {
  id: "terminal",
  title: "Terminal",
  style: {
    width: 640,
    height: 480,
  },
  serviceClasses: [SocketIOService],
  view: function View({ appServices, setResizeHandler }) {
    const socketService = appServices[SocketIOService];
    const [xterm, setXterm] = useState(null);

    const [socketChannel, setSocketChannel] = useState(null);

    // TODO: Remove this and use ResizeObserver directly on Xterm element (https://usefulangle.com/post/319/javascript-detect-element-resize)
    // Refit Xterm when window resizes
    setResizeHandler(() => xterm && xterm.fit());

    // TODO: Refactor
    useEffect(() => {
      if (xterm) {
        socketService
          .createSocketChannel({ type: "terminal" })
          .then(socketChannel => {
            socketChannel.on("data", data => xterm.write(data));

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
        onInput={data => socketChannel && socketChannel.write(data)}
      />
    );
  },
};

export default TerminalApp;
