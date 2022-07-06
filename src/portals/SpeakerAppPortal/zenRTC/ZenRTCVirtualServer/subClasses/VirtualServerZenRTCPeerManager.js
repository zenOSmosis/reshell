import { PhantomCollection, EVT_DESTROY } from "phantom-core";
import SyncObject, { EVT_UPDATE } from "sync-object";
import VirtualServerZenRTCPeer, {
  EVT_CONNECT,
  EVT_DISCONNECT,
  EVT_OUTGOING_MEDIA_STREAM_TRACK_ADD,
  EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVE,
  EVT_INCOMING_MEDIA_STREAM_TRACK_ADD,
  EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVE,
} from "./VirtualServerZenRTCPeer";

export { EVT_DESTROY };

export const EVT_PEER_CONNECT = "peer-connect";
export const EVT_PEER_SHARED_STATE_UPDATE = "peer-shared-state-update";
export const EVT_PEER_OUTGOING_MEDIA_STREAM_TRACK_ADD = `peer-${EVT_OUTGOING_MEDIA_STREAM_TRACK_ADD}`;
export const EVT_PEER_OUTGOING_MEDIA_STREAM_TRACK_REMOVE = `peer-${EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVE}`;
export const EVT_PEER_INCOMING_MEDIA_STREAM_TRACK_ADD = `peer-${EVT_INCOMING_MEDIA_STREAM_TRACK_ADD}`;
export const EVT_PEER_INCOMING_MEDIA_STREAM_TRACK_REMOVE = `peer-${EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVE}`;
export const EVT_PEER_DISCONNECT = "peer-disconnect";
export const EVT_PEER_DESTROY = "peer-destroy";

/**
 * Manages the creation, initial event routing, and destruction of
 * VirtualServerZenRTCPeer instances.
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
      virtualServerZenRTCPeer.registerCleanupHandler(() => {
        readOnlySyncObject.destroy();
      });

      virtualServerZenRTCPeer.on(EVT_CONNECT, () => {
        this.emit(EVT_PEER_CONNECT, virtualServerZenRTCPeer);
      });

      // IMPORTANT: Listening to readOnlySyncObject, not the peer, here
      readOnlySyncObject.on(EVT_UPDATE, updatedState => {
        this.emit(EVT_PEER_SHARED_STATE_UPDATE, [
          virtualServerZenRTCPeer,
          updatedState,
        ]);
      });

      virtualServerZenRTCPeer.on(
        EVT_OUTGOING_MEDIA_STREAM_TRACK_ADD,
        mediaStreamTrack => {
          this.emit(EVT_PEER_OUTGOING_MEDIA_STREAM_TRACK_ADD, [
            virtualServerZenRTCPeer,
            mediaStreamTrack,
          ]);
        }
      );

      virtualServerZenRTCPeer.on(
        EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVE,
        mediaStreamTrack => {
          this.emit(EVT_PEER_OUTGOING_MEDIA_STREAM_TRACK_REMOVE, [
            virtualServerZenRTCPeer,
            mediaStreamTrack,
          ]);
        }
      );

      virtualServerZenRTCPeer.on(
        EVT_INCOMING_MEDIA_STREAM_TRACK_ADD,
        mediaStreamTrack => {
          this.emit(EVT_PEER_INCOMING_MEDIA_STREAM_TRACK_ADD, [
            virtualServerZenRTCPeer,
            mediaStreamTrack,
          ]);
        }
      );

      virtualServerZenRTCPeer.on(
        EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVE,
        mediaStreamTrack => {
          this.emit(EVT_PEER_INCOMING_MEDIA_STREAM_TRACK_REMOVE, [
            virtualServerZenRTCPeer,
            mediaStreamTrack,
          ]);
        }
      );

      virtualServerZenRTCPeer.on(EVT_DISCONNECT, () => {
        this.emit(EVT_PEER_DISCONNECT, virtualServerZenRTCPeer);
      });

      virtualServerZenRTCPeer.on(EVT_DESTROY, () => {
        this.emit(EVT_PEER_DESTROY, virtualServerZenRTCPeer);
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
    return super.destroy(async () => {
      await this.destroyAllChildren();
    });
  }
}
