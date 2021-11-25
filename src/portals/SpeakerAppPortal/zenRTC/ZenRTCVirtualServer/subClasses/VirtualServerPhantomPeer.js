import PhantomPeerCore from "../../PhantomPeerCore";

// TODO: Use map or collection
const _instances = {};

/**
 * A virtual participant from the perspective of the virtualServer.
 */
export default class VirtualServerPhantomPeer extends PhantomPeerCore {
  /**
   * @param {string} signalBrokerId
   * @returns {PhantomPeer}
   */
  static getInstanceWithSignalBrokerId(signalBrokerId) {
    for (const p of Object.values(_instances)) {
      const testId = p.getSignalBrokerId();

      if (testId === signalBrokerId) {
        return p;
      }
    }
  }

  /**
   * @param {string} deviceAddress
   * @param {string} signalBrokerId
   * @param {Object} rest? [optional; default = {}] The this value is passed to
   * the super PhantomPeer class.
   */
  constructor(deviceAddress, signalBrokerId, rest = {}) {
    if (!deviceAddress) {
      throw new Error("deviceAddress must be defined");
    }

    if (!signalBrokerId) {
      throw new Error("initialSocketId must be defined");
    }

    super({ ...rest });

    this._deviceAddress = deviceAddress;
    this._signalBrokerId = signalBrokerId;

    _instances[this._deviceAddress] = this;
  }

  /**
   * @return {string[]}
   */
  getSignalBrokerId() {
    return this._signalBrokerId;
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    delete _instances[this._deviceAddress];

    await super.destroy();
  }
}
