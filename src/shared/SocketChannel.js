import PhantomCore, { EVT_DESTROY } from "phantom-core";

const EVT_CONNECTED = "connect";
const EVT_DATA = "data";
const EVT_BEFORE_REMOTE_DISCONNECT = "beforeRemoteDisconnect";
const EVT_DISCONNECTED = "disconnect";

export {
  EVT_DESTROY,
  EVT_CONNECTED,
  EVT_DATA,
  EVT_BEFORE_REMOTE_DISCONNECT,
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
   * Utilized to send arbitrary event over static channelId event.
   *
   * @param {string} eventName
   * @param {number | string | boolean | Object | ArrayBuffer} eventData
   * @return {void}
   */
  static marshalEventData(eventName, eventData) {
    return [eventName, eventData];
  }

  /**
   * Utilized to determine arbitrary event name and data from Socket.io socket
   * data.
   *
   * @param {any} socketData
   * @return {Object<{eventName: string, eventData: any}>}
   */
  static unmarshalEventData(socketData) {
    const [eventName, eventData] = socketData;

    return { eventName, eventData };
  }

  /**
   * @param {Object} socket socket.io socket.
   * @param {string} channelId? If null, a channel id will be created
   * internally and this instance will become the host instance.
   */
  constructor(socket, channelId = null) {
    super();

    this._receiveSocketData = this._receiveSocketData.bind(this);

    this._socket = socket;

    this._channelId = channelId || `socketChannel/${this.getUUID()}`;

    this._initSocketHandler();

    // TODO: Replace setTimeout w/ setImmediate:
    // @see https://github.com/zenOSmosis/phantom-core/issues/76
    setTimeout(() => {
      this.emit(EVT_CONNECTED);

      this.log(`Created data channel with id: ${this._channelId}`);
    }, 1);

    // Handle channel auto-destruct when socket disconnects
    (() => {
      const _handleSocketDisconnected = () => {
        if (!this.UNSAFE_getIsDestroying()) {
          this.destroy();
        }
      };

      this._socket.once(EVT_DISCONNECTED, _handleSocketDisconnected);

      this.once(EVT_DESTROY, () => {
        this._socket.off(EVT_DISCONNECTED, _handleSocketDisconnected);
      });
    })();
  }

  /**
   * Adds Socket.io event listener to pass relevant events through this
   * channel.
   *
   * @return {void}
   */
  _initSocketHandler() {
    // Initialize the channel on the socket
    this._socket.on(this._channelId, this._receiveSocketData);
  }

  /**
   * Removes Socket.io event listener which was passing relevant events through
   * this channel.
   *
   * @return {void}
   */
  _deinitSocketHandler() {
    // De-initialize the channel on the socket
    this._socket.off(this._channelId, this._receiveSocketData);
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    return super.destroy(() => {
      this.log(`Destructing data channel with id: ${this._channelId}`);

      // IMPORTANT: Emits remotely (let the other peer know we're shutting down)
      this.emit(EVT_BEFORE_REMOTE_DISCONNECT);

      this._deinitSocketHandler();
      // Rebind this emit on super so that shutdown events can be captured
      // locally
      // IMPORTANT: Events emit after this statement will emit locally instead of
      // the other peer
      this.emit = super.emit;

      // Emits locally
      this.emit(EVT_DISCONNECTED);
    });
  }

  /**
   * Alias for this.destroy().
   *
   * @return {Promise<void>}
   */
  async disconnect() {
    if (!this.UNSAFE_getIsDestroying()) {
      return this.destroy();
    }
  }

  /**
   * @return {string | number}
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
   * IMPORTANT: At this time, received event acknowledgement is not supported
   * over SocketChannel (but probably should be).  It will need to be wired up
   * to this._receiveSocketData as well, and have bidirectional support.
   *
   * @param {string} eventName
   * @param  {number | string | boolean | Object | ArrayBuffer} eventData
   * @return {void}
   */
  emit(eventName, eventData) {
    // Send arbitrary event data over Socket.io
    this._socket.emit(
      this._channelId,
      SocketChannel.marshalEventData(eventName, eventData)
    );
  }

  /**
   * Writes data to the other peer, using EVT_DATA event emission.
   *
   * @param  {number | string | boolean | Object | ArrayBuffer} data
   * @return {void}
   */
  write(data) {
    return this.emit(EVT_DATA, data);
  }

  /**
   * Receives socket data captured from Socket.io event handler, unmarshals
   * it, and re-emits it out the socket channel.
   *
   * @param {any} socketData
   * @return {void}
   */
  _receiveSocketData(socketData) {
    const { eventName, eventData } =
      SocketChannel.unmarshalEventData(socketData);

    if (eventName === EVT_BEFORE_REMOTE_DISCONNECT) {
      this.disconnect();
    }

    // Pass underneath this instance, so we don't re-emit over Socket.io
    super.emit(eventName, eventData);
  }
}
