import PhantomCore, { EVT_DESTROYED } from "phantom-core";
import ZenRTCPeer from "../ZenRTCPeer";

export { EVT_DESTROYED };

export default class ZenRTCPeerBaseModule extends PhantomCore {
  constructor(zenRTCPeer) {
    if (!(zenRTCPeer instanceof ZenRTCPeer)) {
      throw new TypeError("zenRTCPeer must be a ZenRTCPeer instance");
    }

    super();

    this._zenRTCPeer = zenRTCPeer;
    this.registerShutdownHandler(() => {
      this._zenRTCPeer = null;
    });

    // Destroy this module once peer is destroyed
    this._zenRTCPeer.registerShutdownHandler(() => {
      if (!this.getIsDestroying()) {
        this.destroy();
      }
    });
  }

  /**
   * @return {ZenRTCPeer}
   */
  getZenRTCPeer() {
    return this._zenRTCPeer;
  }
}
