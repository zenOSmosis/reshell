import LED from "@components/LED";

import DevHostBridgeSocketIOService from "@services/DevHostBridgeSocketIOService";
import SocketAPIMockService from "./services/SocketAPIMockService";
import HostBridgeAPIMockService from "./services/HostBridgeAPIMockService";

import SocketChannel, { EVT_DATA } from "@shared/SocketChannel";

const HostBridgeApp = {
  id: "host-bridge",
  title: "Host Bridge",
  style: {
    width: 640,
    height: 480,
  },
  serviceClasses: [
    DevHostBridgeSocketIOService,
    SocketAPIMockService,
    HostBridgeAPIMockService,
  ],
  view: function View({ windowController, appServices }) {
    const socketService = appServices[DevHostBridgeSocketIOService];

    const hasSocketIOService = Boolean(socketService);
    const isSocketConnected = socketService.getIsConnected();

    return (
      <div>
        <ul>
          <li>
            <LED color={appServices ? "green" : "gray"} /> Service core
          </li>
          <li>
            <LED color={hasSocketIOService ? "green" : "gray"} /> Socket.io
            service
            <div>
              <LED color={isSocketConnected ? "green" : "gray"} />
              <button
                onClick={() =>
                  isSocketConnected
                    ? socketService.disconnect()
                    : socketService.connect()
                }
                disabled={!hasSocketIOService}
              >
                {!isSocketConnected ? "Connect" : "Disconnect"}
              </button>

              {
                // TODO: Remove
              }
              <button
                onClick={() =>
                  socketService
                    .fetchSocketAPICall("request-data-channel")
                    .then(resp => {
                      const { channelId } = resp;

                      // TODO: Refactor
                      const socketChannel = new SocketChannel(
                        socketService.getSocket(),
                        channelId
                      );

                      // TODO: Remove
                      socketChannel.on(EVT_DATA, data => {
                        console.log({ received: data });

                        // socketChannel.destroy();
                      });

                      // TODO: Use equal assertion
                      console.log({
                        resp,
                        remoteSocketChannelId: channelId,
                        localSocketChannelId: socketChannel.getChannelId(),
                      });
                    })
                }
                disabled={!socketService.getIsConnected()}
              >
                Emit test hello!
              </button>
            </div>
          </li>
          <li>
            TODO: Host Bridge API / SocketAPI
            <div>
              <LED color="gray" />
              <button>View</button>
            </div>
          </li>
          <li>TODO: Filesystem bindings</li>
        </ul>
      </div>
    );
  },
};

export default HostBridgeApp;
