import PhantomPeerCore from "../PhantomPeerCore";

// TODO: Use map or collection
const _instances = {};

/**
 * A virtual participant from the perspective of the virtualServer.
 */
export default class PhantomPeerHostPerspective extends PhantomPeerCore {
  /**
   * @param {string} socketId
   * @returns {PhantomPeer}
   */
  static getInstanceWithSocketId(socketId) {
    for (const p of Object.values(_instances)) {
      const testId = p.getSocketId();

      if (testId === socketId) {
        return p;
      }
    }
  }

  /**
   * @param {string} deviceAddress
   * @param {string} socketId
   * @param {Object} rest? [optional; default = {}] The this value is passed to
   * the super PhantomPeer class.
   */
  constructor(deviceAddress, socketId, rest = {}) {
    if (!deviceAddress) {
      throw new Error("deviceAddress must be defined");
    }

    if (!socketId) {
      throw new Error("initialSocketId must be defined");
    }

    super({ ...rest });

    this._deviceAddress = deviceAddress;
    this._socketId = socketId;

    _instances[this._deviceAddress] = this;
  }

  /**
   * @return {string[]}
   */
  getSocketId() {
    return this._socketId;
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    delete _instances[this._deviceAddress];

    await super.destroy();
  }
}
