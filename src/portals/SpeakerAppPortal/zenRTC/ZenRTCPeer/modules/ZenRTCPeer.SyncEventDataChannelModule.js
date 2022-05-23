import BaseModule from "./ZenRTCPeer.BaseModule";
import { EVT_DATA } from "./ZenRTCPeer.DataChannelManagerModule";

// For synced events over WebRTC data channel
const SYNC_EVENTS_DATA_CHANNEL_NAME = "sync-events";

/**
 * Sync events are intended for simple, RPC-like calls.
 */
export default class SyncEventDataChannelModule extends BaseModule {
  constructor(zenRTCPeer) {
    super(zenRTCPeer);

    this._dataChannel = zenRTCPeer.createDataChannel(
      SYNC_EVENTS_DATA_CHANNEL_NAME
    );

    this._dataChannel.on(EVT_DATA, data => {
      const [eventName, eventData] = data;

      this.receiveSyncEvent(eventName, eventData);
    });

    this.registerCleanupHandler(async () => {
      if (!this._dataChannel.getHasDestroyStarted()) {
        await this._dataChannel.destroy();
      }
    });
  }

  /**
   * Send sync event to other peer.
   *
   * @param {string} eventName
   * @param {any} eventData
   */
  emitSyncEvent(eventName, eventData) {
    this._dataChannel.send([eventName, eventData]);
  }

  /**
   * Handles receiving of sync event from other peer.
   *
   * @param {string} eventName
   * @param {any} eventData? [default=null]
   */
  receiveSyncEvent(eventName, eventData = null) {
    this._zenRTCPeer.receiveSyncEvent(eventName, eventData);
  }
}
