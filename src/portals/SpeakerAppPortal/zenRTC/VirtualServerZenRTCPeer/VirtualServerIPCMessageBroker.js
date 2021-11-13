import ZenRTCSignalBroker, {
  TYPE_ZEN_RTC_SIGNAL,
} from "../../shared/ZenRTCSignalBroker";

export { TYPE_ZEN_RTC_SIGNAL };

// TODO: Build out
// TODO: @see https://github.com/zenOSmosis/speaker.app/blob/main/frontend.web/src/baseApps/TranscoderApp/subClasses/TranscoderZenRTCSignalBroker.js
export default class VirtualServerZenRTCSignalBroker extends ZenRTCSignalBroker {
  constructor({ socketIdTo, socket, ...rest }) {
    super({ socketIdTo, ...rest });

    // TODO: Enable to co-exist over same Socket.io connection as local ZenRTCPeer

    this._socket = socket;
    this._initiatorSocketIoId = socketIdTo;
  }

  // TODO: Document
  sendMessage(data) {
    this.log.debug("sending message", {
      data,
      to: this._initiatorSocketIoId,
    });

    this._socket.emit(TYPE_ZEN_RTC_SIGNAL, {
      realmId: this._realmId,
      channelId: this._channelId,
      socketIdTo: this._initiatorSocketIoId,
      socketIdFrom: this._socket.id,
      ...data,
    });
  }
}
