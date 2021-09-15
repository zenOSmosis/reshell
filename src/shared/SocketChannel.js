import PhantomCore, { EVT_DESTROYED } from "phantom-core";

const EVT_CONNECTED = "connect";
const EVT_DATA = "data";
const EVT_BEFORE_DISCONNECT = "beforeDisconnect";
const EVT_DISCONNECTED = "disconnect";

export {
  EVT_DESTROYED,
  EVT_CONNECTED,
  EVT_DATA,
  EVT_BEFORE_DISCONNECT,
  EVT_DISCONNECTED,
};

/**
 * Client / Server bidirectional communications on top of an existing
 * Socket.io socket connection.
 *
 * It's like a virtual socket on a socket, w/ it's own event connect /
 * disconnect events.
 */
export default class SocketChannel extends PhantomCore {
  /**
   * @param {Object} socket socket.io socket.
   * @param {string} channelId? If null, a channel id will be created
   * internally and this instance will become the host instance.
   */
  constructor(socket, channelId = null) {
    super();

    this._socket = socket;

    this._channelId = channelId || `socketChannel/${this.getUUID()}`;

    // Initialize the channel on the socket
    this._socket.on(this._channelId, this._receiveSocketData.bind(this));

    // Simulate connect in next tick; TODO: Refactor to PhantomCore async init?
    // (process.nextTick may not be available on client, hence the timeout)
    setTimeout(() => {
      this.emit(EVT_CONNECTED);

      this.log(`Created data channel with id: ${this._channelId}`);
    }, 1);

    // Handle channel auto-destruct when socket disconnects
    (() => {
      const _handleSocketDisconnected = () => {
        this.destroy();
      };

      this._socket.once(EVT_DISCONNECTED, _handleSocketDisconnected);

      this.once(EVT_DESTROYED, () => {
        this._socket.off(EVT_DISCONNECTED, _handleSocketDisconnected);
      });
    })();
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    this.log(`Destructing data channel with id: ${this._channelId}`);

    // De-initialize the channel on the socket
    this._socket.off(this._channelId, this._receiveSocketData.bind(this));
    // Rebind this emit on super so that shutdown events can be captured locally
    this.emit = super.emit;

    this.emit(EVT_BEFORE_DISCONNECT);

    this.emit(EVT_DISCONNECTED);

    return super.destroy();
  }

  // TODO: Document
  async disconnect() {
    return this.destroy();
  }

  /**
   * @return {string}
   */
  getChannelId() {
    return this._channelId;
  }

  /**
   * Emits data over the underlying Socket.io connection.
   *
   * IMPORTANT: This does not call super.emit(); it only emits to the other
   * peer.
   *
   * @param {string} eventName
   * @param {any} data
   * @return {void}
   */
  emit(eventName, data) {
    // Send artbitrary event data over Socket.io
    this._socket.emit(this._channelId, [eventName, data]);
  }

  // TODO: Document
  write(data) {
    return this.emit(EVT_DATA, data);
  }

  // TODO: Document
  _receiveSocketData(socketData) {
    const [eventName, data] = socketData;

    if (eventName === EVT_BEFORE_DISCONNECT) {
      this.disconnect();
    }

    // Pass underneath this instance, so we don't re-emit over Socket.io
    super.emit(eventName, data);
  }

  /**
   * Converts a string to an ArrayBuffer.
   *
   * This could be a bad approach...
   * @see https://github.com/xtermjs/xterm.js/issues/1972
   *
   * The original work came from:
   * @see http://stackoverflow.com/a/11058858 (modified to work w/ Unit8Array)
   *
   * @param {string}
   * @return {ArrayBuffer}
   */
  /*
  str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
  */

  /**
   * Converts an ArrayBuffer to a string.
   *
   * This could be a bad approach...
   * @see https://github.com/xtermjs/xterm.js/issues/1972
   *
   * The original work came from:
   * @see http://stackoverflow.com/a/11058858 (modified to work w/ Unit8Array)
   *
   * @param {ArrayBuffer} buf
   * @return {string}
   */
  /*
  ab2str(buf) {
    const str = String.fromCharCode.apply(null, new Uint8Array(buf));
    return str;
  }
  */
}
