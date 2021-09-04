import UIServiceCore from "../../core/classes/UIServiceCore";

import io from "socket.io-client";

/**
 * Provides SocketIO servicing for ReShell.
 */
export default class SocketIOService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    // this._io = //

    // TODO: Bind to Socket.io state
    this._isConnected = false;
  }

  // TODO: Document
  connect() {
    // TODO: Connect to Socket.io
  }

  // TODO: Document
  disconnect() {
    // TODO: Disconnect from Socket.io
  }

  // TODO: Document
  getIsOnline() {
    return this._isConnected;
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    this.disconnect();

    return super.destroy();
  }
}
