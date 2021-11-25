import { PhantomCollection, EVT_DESTROYED } from "phantom-core";
import VirtualServerZenRTCPeer, {
  EVT_CONNECTED,
  EVT_DISCONNECTED,
  EVT_UPDATED,
} from "./VirtualServerZenRTCPeer";

export { EVT_DESTROYED };

export const EVT_PEER_CONNECTED = "peer-connected";
export const EVT_PEER_DISCONNECTED = "peer-disconnected";
export const EVT_PEER_DESTROYED = "peer-destroyed";
export const EVT_PEER_UPDATED = "peer-updated";

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
    sharedWritableSyncObject,
  }) {
    super();

    this._realmId = realmId;
    this._channelId = channelId;
    this._deviceAddress = deviceAddress;
    this._socket = socket;
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

      const virtualServerZenRTCPeer = new VirtualServerZenRTCPeer({
        ourSocket: this._socket,
        realmId: this._realmId,
        channelId: this._channelId,
        clientSocketId,
        clientSignalBrokerId,

        // zenRTCSignalBrokerId: zenRTCSignalBrokerId,
        // NOTE: The writable is shared between all of the participants and
        // does not represent a single participant (it symbolized all of them)
        writableSyncObject: this._sharedWritableSyncObject,

        // TODO: Re-enable
        // readOnlySyncObject,
      });

      this.proxyOn(virtualServerZenRTCPeer, EVT_CONNECTED, () => {
        this.emit(EVT_PEER_CONNECTED, virtualServerZenRTCPeer);
      });

      this.proxyOn(virtualServerZenRTCPeer, EVT_DISCONNECTED, () => {
        this.emit(EVT_PEER_DISCONNECTED, virtualServerZenRTCPeer);
      });

      this.proxyOn(virtualServerZenRTCPeer, EVT_UPDATED, () => {
        this.emit(EVT_PEER_UPDATED, virtualServerZenRTCPeer);
      });

      this.proxyOn(virtualServerZenRTCPeer, EVT_DESTROYED, () => {
        this.emit(EVT_PEER_DESTROYED, virtualServerZenRTCPeer);
      });

      // Register the peer in the collection
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
  getZenRTCPeers() {
    return this.getChildren();
  }
}
