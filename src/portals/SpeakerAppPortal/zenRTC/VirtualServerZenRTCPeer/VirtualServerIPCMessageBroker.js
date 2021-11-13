import IPCMessageBroker, {
  TYPE_WEB_IPC_MESSAGE,
} from "../../shared/IPCMessageBroker";

export { TYPE_WEB_IPC_MESSAGE };

// TODO: Build out
// TODO: @see https://github.com/zenOSmosis/speaker.app/blob/main/frontend.web/src/baseApps/TranscoderApp/subClasses/TranscoderIPCMessageBroker.js
export default class VirtualServerIPCMessageBroker extends IPCMessageBroker {
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

    this._socket.emit(TYPE_WEB_IPC_MESSAGE, {
      realmId: this._realmId,
      channelId: this._channelId,
      socketIdTo: this._initiatorSocketIoId,
      socketIdFrom: this._socket.id,
      ...data,
    });
  }
}
