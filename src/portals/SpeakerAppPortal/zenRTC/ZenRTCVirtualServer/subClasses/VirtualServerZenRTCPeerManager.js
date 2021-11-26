import { PhantomCollection, EVT_DESTROYED } from "phantom-core";
import SyncObject, { EVT_UPDATED } from "sync-object";
import VirtualServerZenRTCPeer, {
  EVT_CONNECTED,
  EVT_DISCONNECTED,
  EVT_OUTGOING_MEDIA_STREAM_TRACK_ADDED,
  EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVED,
  EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED,
  EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED,
} from "./VirtualServerZenRTCPeer";

export { EVT_DESTROYED };

export const EVT_PEER_CONNECTED = "peer-connected";
export const EVT_PEER_SHARED_STATE_UPDATED = "peer-shared-state-updated";
export const EVT_PEER_OUTGOING_MEDIA_STREAM_TRACK_ADDED = `peer-${EVT_OUTGOING_MEDIA_STREAM_TRACK_ADDED}`;
export const EVT_PEER_OUTGOING_MEDIA_STREAM_TRACK_REMOVED = `peer-${EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVED}`;
export const EVT_PEER_INCOMING_MEDIA_STREAM_TRACK_ADDED = `peer-${EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED}`;
export const EVT_PEER_INCOMING_MEDIA_STREAM_TRACK_REMOVED = `peer-${EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED}`;
export const EVT_PEER_DISCONNECTED = "peer-disconnected";
export const EVT_PEER_DESTROYED = "peer-destroyed";

// TODO: Use secured indexeddb for storing of messages, etc.
// (i.e. something like: https://github.com/AKASHAorg/secure-webstore)

/**
 * Manages the creation, updating, and destroying of VirtualServerZenRTCPeer instances.
 */
export default class VirtualServerZenRTCPeerManager extends PhantomCollection {
  /**
   * Gets the unique key to identify a peer.
   *
   * @param {string} clientDeviceAddress
   * @param {string} clientSignalBrokerId
   * @return {string}
   */
  static getPeerKey(clientDeviceAddress, clientSignalBrokerId) {
    return `${clientDeviceAddress}-${clientSignalBrokerId}`;
  }

  // TODO: Document
  constructor({
    realmId,
    channelId,
    deviceAddress,
    socket,
    iceServers,
    sharedWritableSyncObject,
  }) {
    super();

    this._realmId = realmId;
    this._channelId = channelId;
    this._deviceAddress = deviceAddress;
    this._socket = socket;
    this._iceServers = iceServers;
    this._sharedWritableSyncObject = sharedWritableSyncObject;
  }

  // TODO: Document
  addChild(virtualServerZenRTCPeer, clientDeviceAddress, clientSignalBrokerId) {
    if (!(virtualServerZenRTCPeer instanceof VirtualServerZenRTCPeer)) {
      throw new TypeError(
        "virtualServerZenRTCPeer is not a VirtualServerZenRTCPeer instance"
      );
    }

    const peerKey = VirtualServerZenRTCPeerManager.getPeerKey(
      clientDeviceAddress,
      clientSignalBrokerId
    );

    return super.addChild(virtualServerZenRTCPeer, peerKey);
  }

  /**
   * @param {string} clientSocketId
   * @param {string} clientDeviceAddress
   * @param {string} clientSignalBrokerId
   * @return {VirtualServerZenRTCPeer}
   */
  getOrCreateZenRTCPeer(
    clientSocketId,
    clientDeviceAddress,
    clientSignalBrokerId
  ) {
    const existingPeer = this.getChildWithKey(
      VirtualServerZenRTCPeerManager.getPeerKey(
        clientDeviceAddress,
        clientSignalBrokerId
      )
    );

    if (existingPeer) {
      return existingPeer;
    } else {
      // Create peer

      const readOnlySyncObject = new SyncObject();

      const virtualServerZenRTCPeer = new VirtualServerZenRTCPeer({
        ourSocket: this._socket,
        iceServers: this._iceServers,
        realmId: this._realmId,
        channelId: this._channelId,
        clientSocketId,
        clientSignalBrokerId,

        // zenRTCSignalBrokerId: zenRTCSignalBrokerId,
        // NOTE: The writable is shared between all of the participants and
        // does not represent a single participant (it symbolized all of them)
        writableSyncObject: this._sharedWritableSyncObject,

        readOnlySyncObject,
      });

      // Destruct read-only sync object when peer is destructed
      virtualServerZenRTCPeer.registerShutdownHandler(() => {
        readOnlySyncObject.destroy();
      });

      virtualServerZenRTCPeer.on(EVT_CONNECTED, () => {
        this.emit(EVT_PEER_CONNECTED, virtualServerZenRTCPeer);
      });

      // IMPORTANT: Listening to readOnlySyncObject, not the peer, here
      readOnlySyncObject.on(EVT_UPDATED, updatedState => {
        this.emit(EVT_PEER_SHARED_STATE_UPDATED, [
          virtualServerZenRTCPeer,
          updatedState,
        ]);
      });

      virtualServerZenRTCPeer.on(
        EVT_OUTGOING_MEDIA_STREAM_TRACK_ADDED,
        mediaStreamTrack => {
          this.emit(EVT_PEER_OUTGOING_MEDIA_STREAM_TRACK_ADDED, [
            virtualServerZenRTCPeer,
            mediaStreamTrack,
          ]);
        }
      );

      virtualServerZenRTCPeer.on(
        EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVED,
        mediaStreamTrack => {
          this.emit(EVT_PEER_OUTGOING_MEDIA_STREAM_TRACK_REMOVED, [
            virtualServerZenRTCPeer,
            mediaStreamTrack,
          ]);
        }
      );

      virtualServerZenRTCPeer.on(
        EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED,
        mediaStreamTrack => {
          this.emit(EVT_PEER_INCOMING_MEDIA_STREAM_TRACK_ADDED, [
            virtualServerZenRTCPeer,
            mediaStreamTrack,
          ]);
        }
      );

      virtualServerZenRTCPeer.on(
        EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED,
        mediaStreamTrack => {
          this.emit(EVT_PEER_INCOMING_MEDIA_STREAM_TRACK_REMOVED, [
            virtualServerZenRTCPeer,
            mediaStreamTrack,
          ]);
        }
      );

      virtualServerZenRTCPeer.on(EVT_DISCONNECTED, () => {
        this.emit(EVT_PEER_DISCONNECTED, virtualServerZenRTCPeer);
      });

      virtualServerZenRTCPeer.on(EVT_DESTROYED, () => {
        this.emit(EVT_PEER_DESTROYED, virtualServerZenRTCPeer);
      });

      // Register the peer in the collection
      // NOTE: This child will be destructed once the collection is
      this.addChild(
        virtualServerZenRTCPeer,
        clientDeviceAddress,
        clientSignalBrokerId
      );

      // Automatically connect
      virtualServerZenRTCPeer.connect();

      return virtualServerZenRTCPeer;
    }
  }

  /**
   * @return {VirtualServerZenRTCPeer[]}
   */
  getConnectedZenRTCPeers() {
    return this.getChildren().filter(zenRTCPeer => zenRTCPeer.getIsConnected());
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    this.destroyAllChildren();

    return super.destroy();
  }
}
