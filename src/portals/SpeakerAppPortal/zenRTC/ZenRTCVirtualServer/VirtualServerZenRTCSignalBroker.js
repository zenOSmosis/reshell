import ZenRTCSignalBroker, {
  SOCKET_EVT_ZENRTC_SIGNAL,
  EVT_MESSAGE_RECEIVED,
} from "../../shared/ZenRTCSignalBroker";

export { SOCKET_EVT_ZENRTC_SIGNAL, EVT_MESSAGE_RECEIVED };

// TODO: Build out
// TODO: @see https://github.com/zenOSmosis/speaker.app/blob/main/frontend.web/src/baseApps/VirtualServerApp/subClasses/VirtualServerZenRTCSignalBroker.js
export default class VirtualServerZenRTCSignalBroker extends ZenRTCSignalBroker {
  constructor({ socketIdTo, socket, signalBrokerIdTo, ...rest }) {
    super({ socketIdTo, ...rest });

    // TODO: Enable to co-exist over same Socket.io connection as local ZenRTCPeer

    this._socket = socket;
    this._socketIdTo = socketIdTo;
    this._signalBrokerIdTo = signalBrokerIdTo;
  }

  // TODO: Document
  sendMessage(data) {
    this.log.debug("sending message", {
      data,
      to: this._socketIdTo,
    });

    this._socket.emit(SOCKET_EVT_ZENRTC_SIGNAL, {
      realmId: this._realmId,
      channelId: this._channelId,
      socketIdTo: this._socketIdTo,
      socketIdFrom: this._socket.id,
      signalBrokerIdFrom: this._signalBrokerIdFrom,
      signalBrokerIdTo: this._signalBrokerIdTo,
      ...data,
    });
  }
}
