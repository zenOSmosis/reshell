import IPCMessageBroker, {
  EVT_DESTROYED,
  EVT_MESSAGE_RECEIVED,
  EVT_READY_STATE_CHANGED,
  TYPE_WEB_IPC_MESSAGE,
} from "../shared/IPCMessageBroker";

export {
  EVT_READY_STATE_CHANGED,
  EVT_MESSAGE_RECEIVED,
  EVT_DESTROYED,
  TYPE_WEB_IPC_MESSAGE,
};

// TODO: Document
// @see https://github.com/zenOSmosis/speaker.app/blob/main/frontend.web/src/WebIPCMessageBroker/WebIPCMessageBroker.js
export default class LocalIPCMessageBroker extends IPCMessageBroker {
  // TODO: Document
  constructor({ socket, ...rest }) {
    super({ ...rest });

    this._socket = socket;

    // Handle all incoming WebIPC messages
    //
    // IMPORTANT: These are not multiplexed at the moment; all
    // WebIPCMessageBroker instances will receive the same message
    (() => {
      const _handleReceiveMessage = message => {
        // TODO: Only emit if the received message corresponds to same realmID and channelID

        this.receiveMessage(message);
      };

      socket.on(TYPE_WEB_IPC_MESSAGE, _handleReceiveMessage);

      this.once(EVT_DESTROYED, () => {
        socket.off(TYPE_WEB_IPC_MESSAGE, _handleReceiveMessage);
      });
    })();
  }

  sendMessage(message) {
    const {
      realmId = this._realmId,
      channelId = this._channelId,
      socketIoIdFrom = this._socketIoIdFrom,
      socketIoIdTo = this._socketIoIdTo,
      ...rest
    } = message;

    this._socket.emit(TYPE_WEB_IPC_MESSAGE, {
      realmId,
      channelId,
      socketIoIdFrom,
      socketIoIdTo,
      ...rest,
    });
  }
}
