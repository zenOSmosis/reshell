import PhantomPeerSyncObject from "../../PhantomPeerSyncObject";

// TODO: Use map or collection
const _instances = {};

/**
 * A virtual participant from the perspective of the virtualServer.
 */
export default class VirtualServerPhantomPeer extends PhantomPeerSyncObject {
  /**
   * @param {string} clientSignalBrokerId
   * @returns {VirtualServerPhantomPeer | void}
   */
  static getInstanceWithClientSignalBrokerId(clientSignalBrokerId) {
    for (const p of Object.values(_instances)) {
      const testId = p.getSignalBrokerId();

      if (testId === clientSignalBrokerId) {
        return p;
      }
    }
  }

  /**
   * @param {string} clientSignalBrokerId
   * @param {Object} rest? [optional; default = {}] The this value is passed to
   * the super PhantomPeerSyncObject class.
   */
  constructor(clientSignalBrokerId, rest = {}) {
    if (!clientSignalBrokerId) {
      throw new Error("deviceAddress must be defined");
    }

    if (!clientSignalBrokerId) {
      throw new Error("initialSocketId must be defined");
    }

    super({ ...rest });

    this._clientSignalBrokerId = clientSignalBrokerId;

    _instances[this._clientSignalBrokerId] = this;
    this.registerShutdownHandler(() => {
      delete _instances[this._clientSignalBrokerId];
    });
  }

  /**
   * @return {string}
   */
  getClientSignalBrokerId() {
    return this._clientSignalBrokerId;
  }
}
