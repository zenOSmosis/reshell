import PhantomCore, { EVT_DESTROY } from "phantom-core";
import ZenRTCPeer from "../ZenRTCPeer";

export { EVT_DESTROY };

export default class ZenRTCPeerBaseModule extends PhantomCore {
  constructor(zenRTCPeer) {
    if (!(zenRTCPeer instanceof ZenRTCPeer)) {
      throw new TypeError("zenRTCPeer must be a ZenRTCPeer instance");
    }

    super();

    this._zenRTCPeer = zenRTCPeer;

    // Destroy this module once peer is destroyed
    this._zenRTCPeer.registerCleanupHandler(async () => {
      if (!this.UNSAFE_getIsDestroying()) {
        await this.destroy();
      }
    });
  }

  /**
   * @return {ZenRTCPeer}
   */
  getZenRTCPeer() {
    return this._zenRTCPeer;
  }

  /**
   * @param {Function} destroyHandler? [optional] If defined, will execute
   * prior to normal destruct operations for this class.
   * @return {Promise<void>}
   */
  async destroy(destroyHandler = () => null) {
    return super.destroy(async () => {
      await destroyHandler();

      this._zenRTCPeer = null;
    });
  }
}
