import UIServiceCore from "@core/classes/UIServiceCore";
import SocketChannel from "@shared/SocketChannel";

import { io } from "socket.io-client";

export const EVT_CONNECTED = "connected";
export const EVT_DISCONNECTED = "disconnected";

/**
 * Provides SocketIO servicing for ReShell.
 */
export default class SocketIOService extends UIServiceCore {
  constructor({ ...args }) {
    super({ ...args });

    this._socket = null;

    // Automatically connect
    // this.connect();
  }

  // TODO: Document
  connect(options = {}) {
    if (this.getIsConnected()) {
      return;
    }

    if (this._socket) {
      console.warn("Socket already exists");
      this._socket.connect(options);
    } else {
      // TODO: Include ability to specify io namespace
      //
      // @see https://socket.io/docs/v3/client-api/#iourl
      // (NOTE: options passes as second parameter with custom path does not
      // seem to work, in contract to what the docs indicate)
      const socket = io(options);

      socket.on("connect", () => {
        this.setState({
          isConnected: true,
        });

        this.emit(EVT_CONNECTED);
      });

      socket.on("disconnect", () => {
        this.setState({
          isConnected: false,
        });

        this.emit(EVT_DISCONNECTED);
      });

      this._socket = socket;
    }
  }

  // TODO: Document
  disconnect() {
    this._socket?.disconnect();
  }

  /**
   * @return {boolean}
   */
  getIsConnected() {
    return this.getState().isConnected;
  }

  // TODO: Document
  getSocket() {
    return this._socket;
  }

  /**
   * @return {string | void}
   */
  getSocketId() {
    return this._socket?.id;
  }

  /**
   * @param {string} apiName
   * @param {Object} requestData [optional]
   * @return {Promise<Object>} requestResponse; TODO: Document
   */
  fetchSocketAPICall(apiName, requestData = {}) {
    return new Promise((resolve, reject) => {
      // TODO: Replace this w/ a shorter hash
      //
      // const debounceId = JSON.stringify(apiName, requestData)
      // const cachedFetch = _fetchMap.get(debounceId)

      const socket = this._socket;

      if (!socket) {
        throw new ReferenceError("Socket does not exist");
      }

      socket.emit(apiName, requestData, ([err, resp]) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(resp);
        }
      });
    });
  }

  /**
   * Sends a request to the Host Bridge to create a SocketChannel and resolves
   * a local SocketChannel which is bound to the remote.
   *
   * TODO: Refactor?
   *
   * @param {Object} options? [default = {}]
   * @return {Promise<SocketChannel>}
   */
  async createSocketChannel(options = {}) {
    if (!this._socket) {
      throw new ReferenceError(
        "Socket is not available to create socket channel"
      );
    }

    const { channelId } = await this.fetchSocketAPICall(
      // TODO: Use constant
      "request-data-channel",
      options
    );

    const socketChannel = new SocketChannel(this._socket, channelId);

    // TODO: Refactor?
    if (socketChannel.getChannelId() !== channelId) {
      throw new ReferenceError(
        "Local SocketChannel does not match same channel id as remote"
      );
    }

    return socketChannel;
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    this.disconnect();

    return super.destroy();
  }
}
