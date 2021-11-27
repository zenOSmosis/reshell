import { PhantomCollection } from "phantom-core";
import VirtualServerZenRTCPeer from "../VirtualServerZenRTCPeer";

// TODO: Send remote remove event when peer has disconnected?

/**
 * Performs media stream routing for all of the peers.
 */
export default class VirtualServerZenRTCPeerPhantomPeerRouter extends PhantomCollection {
  /**
   * Adds a VirtualServerZenRTCPeer instance to the router collection and sets
   * up an initial full media stream sync.
   *
   * @param {VirtualServerZenRTCPeer} virtualServerZenRTCPeer
   * @return {void}
   */
  addChild(virtualServerZenRTCPeer) {
    if (!(virtualServerZenRTCPeer instanceof VirtualServerZenRTCPeer)) {
      throw new TypeError(
        "virtualServerZenRTCPeer is not a VirtualServerZenRTCPeer instance"
      );
    }

    // Duplicate attempts will be silently ignored
    super.addChild(virtualServerZenRTCPeer);

    // IMPORTANT: This must come after super.addChild as other peers are
    // determined by the collection's children
    this.fullSync(virtualServerZenRTCPeer);
  }

  // TODO: Document
  /**
   * @param {VirtualServerZenRTCPeer} virtualServerZenRTCPeer
   * @return {void}
   */
  fullSync(virtualServerZenRTCPeer) {
    const otherPeers = this.getChildren().filter(
      pred => pred !== virtualServerZenRTCPeer
    );

    const ourWritableSyncObject =
      virtualServerZenRTCPeer.getWritableSyncObject();
    const ourReadOnlySyncObject =
      virtualServerZenRTCPeer.getReadOnlySyncObject();

    const ourClientSignalBrokerId =
      virtualServerZenRTCPeer.getClientSignalBrokerId();

    // TODO: Remove
    /*
    console.log({
      writableSyncObject: ourWritableSyncObject.getState(),
      readOnlySyncObject: ourReadOnlySyncObject.getState(),
    });
    */

    for (const otherPeer of otherPeers) {
      const theirWritableSyncObject = otherPeer.getWritableSyncObject();
      const theirReadOnlySyncObject = otherPeer.getReadOnlySyncObject();

      // Write our state to the other clients
      theirWritableSyncObject.setState({
        [ourClientSignalBrokerId]: virtualServerZenRTCPeer.getIsConnected()
          ? ourReadOnlySyncObject.getState()
          : undefined,
      });

      const theirClientSignalBrokerId = otherPeer.getClientSignalBrokerId();

      ourWritableSyncObject.setState({
        [theirClientSignalBrokerId]: otherPeer.getIsConnected()
          ? theirReadOnlySyncObject.getState()
          : undefined,
      });
    }
  }

  // TODO: Implement and document
  handlePeerSharedStateUpdated(virtualServerZenRTCPeer) {
    this.fullSync(virtualServerZenRTCPeer);
  }

  handlePeerDisconnect(virtualServerZenRTCPeer) {
    this.fullSync(virtualServerZenRTCPeer);
  }
}
