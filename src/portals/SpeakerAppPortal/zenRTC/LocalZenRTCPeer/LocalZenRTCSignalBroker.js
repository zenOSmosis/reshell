import ZenRTCSignalBroker, {
  EVT_DESTROYED,
  EVT_ZENRTC_SIGNAL,
  SOCKET_EVT_ZENRTC_SIGNAL,
} from "../../shared/ZenRTCSignalBroker";

export { EVT_ZENRTC_SIGNAL, EVT_DESTROYED, SOCKET_EVT_ZENRTC_SIGNAL };

// TODO: Document
export default class LocalZenRTCSignalBroker extends ZenRTCSignalBroker {
  // TODO: Document
  constructor({ socket, socketIdTo, realmId, channelId }) {
    const socketIdFrom = socket.id;

    super({ socketIdFrom, socketIdTo, realmId, channelId });

    this._socket = socket;

    // Listens for SOCKET_EVT_ZENRTC_SIGNAL on the socket connection and
    // determines if it should be routed to a relevant peer on this virtual
    // network
    (() => {
      const _handleFilterSocketZenRTCSignal = signal => {
        // Filter out irrelevant received signals for this broker
        if (
          signal.signalBrokerIdTo === this._signalBrokerIdFrom &&
          signal.realmId === realmId &&
          signal.channelId === channelId
        ) {
          this.receiveSignal(signal);
        }
      };

      socket.on(SOCKET_EVT_ZENRTC_SIGNAL, _handleFilterSocketZenRTCSignal);

      this.registerCleanupHandler(() => {
        socket.off(SOCKET_EVT_ZENRTC_SIGNAL, _handleFilterSocketZenRTCSignal);
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
