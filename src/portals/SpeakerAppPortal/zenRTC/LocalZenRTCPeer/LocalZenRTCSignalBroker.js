import ZenRTCSignalBroker, {
  EVT_DESTROYED,
  EVT_ZENRTC_SIGNAL,
  SOCKET_EVT_ZENRTC_SIGNAL,
} from "../../shared/ZenRTCSignalBroker";

export { EVT_ZENRTC_SIGNAL, EVT_DESTROYED, SOCKET_EVT_ZENRTC_SIGNAL };

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
      const _handleReceiveSocketSignal = signal => {
        // Filter out irrelevant received signals for this broker
        if (
          signal.signalBrokerIdTo === this._signalBrokerIdFrom &&
          signal.realmId === realmId &&
          signal.channelId === channelId
        ) {
          this.receiveSignal(signal);
        }
      };

      socket.on(SOCKET_EVT_ZENRTC_SIGNAL, _handleReceiveSocketSignal);

      this.registerShutdownHandler(() => {
        socket.off(SOCKET_EVT_ZENRTC_SIGNAL, _handleReceiveSocketSignal);
      });
    })();
  }

  signal(signal) {
    const {
      realmId = this._realmId,
      channelId = this._channelId,
      socketIdFrom = this._socketIdFrom,
      socketIdTo = this._socketIdTo,
      signalBrokerIdFrom = this._signalBrokerIdFrom,
      ...rest
    } = signal;

    // TODO: Remove
    console.log({
      sendingSignal: signal,
    });

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
