import BaseModule from "./ZenRTCPeer.BaseModule";
import { EVT_CONNECT, EVT_DISCONNECT } from "../ZenRTCPeer";

// In milliseconds
const HEARTBEAT_INTERVAL_TIME = 5000;

export default class ZenRTCPeerHeartbeatModule extends BaseModule {
  constructor(zenRTCPeer) {
    super(zenRTCPeer);

    this._heartbeatInterval = null;

    // Perform initial ping on connect
    zenRTCPeer.on(EVT_CONNECT, () => {
      // Perform initial ping
      this.ping();

      // Handle heartbeat ping polling
      this._heartbeatInterval = zenRTCPeer.setInterval(
        () => this.ping,
        HEARTBEAT_INTERVAL_TIME
      );
    });

    zenRTCPeer.on(EVT_DISCONNECT, () => {
      zenRTCPeer.clearInterval(this._heartbeatInterval);
    });
  }

  /**
   * NOTE: Intentionally resolving void here, as no latency value is being
   * captured directly by the heartbeat class.
   *
   * The ZenRTCPeer class will capture its own latency as a result of this
   * call, which can be retrieved by calling ZenRTCPeer.getLatency().
   *
   * @return {Promise<void>}
   */
  async ping() {
    if (!this._zenRTCPeer.getIsConnected()) {
      this.log.warn("Skipping ping because peer is not connected");

      return;
    }

    return this._zenRTCPeer.ping().catch(err => {
      this.log.error("Heartbeat failed", err);

      if (this._zenRTCPeer && !this._zenRTCPeer.getHasDestroyStarted()) {
        this._zenRTCPeer.destroy();
      }
    });
  }
}
