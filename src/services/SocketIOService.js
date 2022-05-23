import UIServiceCore, { EVT_DESTROY } from "@core/classes/UIServiceCore";
import SocketChannel from "@shared/SocketChannel";

import { io } from "socket.io-client";

export const EVT_CONNECT = "connect";
export const EVT_DISCONNECT = "disconnect";

// TODO: Generate UI notifications when socket goes offline / comes online

// TODO: Possibly make this a forced-extended "service.core" (in service.cores directory)
/**
 * Provides SocketIO servicing for ReShell.
 */
export default class SocketIOService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setState({
      isConnected: false,
      // TODO: Include connecting state
      // TODO: Include error state
    });

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

      // TODO: Use event constant
      socket.on("connect", () => {
        this.setState({
          isConnected: true,
        });

        this.emit(EVT_CONNECT);
      });

      // TODO: Use event constant
      socket.on("disconnect", () => {
        this.setState({
          isConnected: false,
        });

        this.emit(EVT_DISCONNECT);
      });

      this._socket = socket;
    }
  }

  /**
   * @param {function} callback? [default = () => null] An optional callback to
   * call once connected.
   * @return {Promise<void>} Resolves once the class instance is ready.
   */
  async onceConnected(callback = () => null) {
    if (this.getIsConnected()) {
      return callback();
    } else {
      return new Promise((resolve, reject) => {
        function handleResolve() {
          this.off(EVT_DESTROY, handleReject);

          callback();

          resolve();
        }

        function handleReject() {
          this.off(EVT_CONNECT, handleResolve);

          reject();
        }

        this.once(EVT_CONNECT, handleResolve);

        this.once(EVT_DESTROY, handleReject);
      });
    }
  }

  /**
   * Disconnects the Socket.io connection, if present.
   *
   * @return {void}
   */
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
   * Retrieves the Socket.io id, if present.
   *
   * @return {string | void}
   */
  getSocketId() {
    return this._socket?.id;
  }

  /**
   * @param {string} apiName
   * @param {Object} requestData? [default = {}]
   * @return {Promise<Object>} requestResponse; TODO: Document
   */
  async fetchSocketAPICall(apiName, requestData = {}) {
    // FIXME: (jh) This shouldn't be needed because Socket.io should buffer the
    // request until the connection has been made
    await this.onceConnected();

    return new Promise((resolve, reject) => {
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
   * Disconnects, then destructs the class instance.
   *
   * @return {Promise<void>}
   */
  async destroy() {
    this.disconnect();

    return super.destroy();
  }
}
