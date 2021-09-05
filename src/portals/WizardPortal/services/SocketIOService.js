import UIServiceCore from "@core/classes/UIServiceCore";

import io from "socket.io-client";

/**
 * Provides SocketIO servicing for ReShell.
 */
export default class SocketIOService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this._socket = null;
  }

  // TODO: Document
  connect() {
    if (this._socket) {
      this._socket.connect();
    } else {
      const socket = io();

      socket.on("connect", () => {
        this.setState({
          isConnected: true,
        });
      });

      socket.on("disconnect", () => {
        this.setState({
          isConnected: false,
        });
      });

      this._socket = socket;
    }
  }

  // TODO: Document
  disconnect() {
    this._socket.disconnect();
  }

  /**
   * @return {boolean}
   */
  getIsConnected() {
    return this.getState().isConnected;
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    this.disconnect();

    return super.destroy();
  }
}
