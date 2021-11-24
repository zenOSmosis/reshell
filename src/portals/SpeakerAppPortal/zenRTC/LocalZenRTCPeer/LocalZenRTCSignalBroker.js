import ZenRTCSignalBroker, {
  EVT_DESTROYED,
  EVT_MESSAGE_RECEIVED,
  SOCKET_EVT_ZENRTC_SIGNAL,
} from "../../shared/ZenRTCSignalBroker";

export { EVT_MESSAGE_RECEIVED, EVT_DESTROYED, SOCKET_EVT_ZENRTC_SIGNAL };

// TODO: Document
// @see https://github.com/zenOSmosis/speaker.app/blob/main/frontend.web/src/WebZenRTCSignalBroker/WebZenRTCSignalBroker.js
export default class LocalZenRTCSignalBroker extends ZenRTCSignalBroker {
  // TODO: Document
  constructor({ socket, socketIdTo, realmId, channelId }) {
    const socketIdFrom = socket.id;

    super({ socketIdFrom, socketIdTo, realmId, channelId });

    this._socket = socket;

    // Handle all incoming WebIPC messages
    //
    // IMPORTANT: These are not multiplexed at the moment; all
    // WebZenRTCSignalBroker instances will receive the same message
    (() => {
      const _handleReceiveMessage = message => {
        if (!message.signalBrokerIdTo) {
          return;
        }

        // TODO: Only emit if the received message corresponds to same realmId and channelId

        // TODO: Additional checks need to be made for this...
        if (message.signalBrokerIdTo === this._signalBrokerIdFrom) {
          this.receiveMessage(message);
        }
      };

      socket.on(SOCKET_EVT_ZENRTC_SIGNAL, _handleReceiveMessage);

      this.registerShutdownHandler(() => {
        socket.off(SOCKET_EVT_ZENRTC_SIGNAL, _handleReceiveMessage);
      });
    })();
  }

  sendMessage(message) {
    const {
      realmId = this._realmId,
      channelId = this._channelId,
      socketIdFrom = this._socketIdFrom,
      socketIdTo = this._socketIdTo,
      signalBrokerIdFrom = this._signalBrokerIdFrom,
      ...rest
    } = message;

    this._socket.emit(SOCKET_EVT_ZENRTC_SIGNAL, {
      realmId,
      channelId,
      socketIdFrom,
      socketIdTo,
      signalBrokerIdFrom,
      ...rest,
    });
  }
}
