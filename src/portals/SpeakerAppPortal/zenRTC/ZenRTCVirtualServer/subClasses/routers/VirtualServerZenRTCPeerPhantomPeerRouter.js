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
    this.sync(virtualServerZenRTCPeer);
  }

  // TODO: Document
  /**
   * IMPORTANT: It is important to know that the underlying mechanism for this
   * is SyncObject, which performs differential state updates across the wire.
   *
   * As such, it currently does not handle arrays and state deletions must be
   * nulled out.
   *
   * @see https://github.com/zenOSmosis/sync-object
   *
   * @param {VirtualServerZenRTCPeer} virtualServerZenRTCPeer
   * @return {void}
   */
  sync(virtualServerZenRTCPeer) {
    const otherPeers = this.getChildren().filter(
      pred => pred !== virtualServerZenRTCPeer
    );

    const ourWritableSyncObject =
      virtualServerZenRTCPeer.getWritableSyncObject();
    const ourReadOnlySyncObject =
      virtualServerZenRTCPeer.getReadOnlySyncObject();

    const ourClientSignalBrokerId =
      virtualServerZenRTCPeer.getClientSignalBrokerId();

    const ourReadOnlyState = virtualServerZenRTCPeer.getIsConnected()
      ? ourReadOnlySyncObject.getState()
      : // IMPORTANT: At this time, SyncObject does not support setting
        // undefined and syncing over the wire, so null is used instead
        //
        // @see https://github.com/zenOSmosis/sync-object/issues/40
        null;

    for (const otherPeer of otherPeers) {
      const theirWritableSyncObject = otherPeer.getWritableSyncObject();
      const theirReadOnlySyncObject = otherPeer.getReadOnlySyncObject();

      // TODO: Prevent loop-back where our state is written to theirs, then written to ours

      const theirReadOnlyState = otherPeer.getIsConnected()
        ? theirReadOnlySyncObject.getState()
        : // IMPORTANT: At this time, SyncObject does not support setting
          // undefined and syncing over the wire, so null is used instead
          //
          // @see https://github.com/zenOSmosis/sync-object/issues/40
          null;

      // if (otherPeer.getIsConnected()) {
      // Write our state to the other clients
      theirWritableSyncObject.setState({
        [ourClientSignalBrokerId]: ourReadOnlyState,
      });
      // }

      const theirClientSignalBrokerId = otherPeer.getClientSignalBrokerId();

      // if (virtualServerZenRTCPeer.getIsConnected()) {
      // Write other client state to ours
      ourWritableSyncObject.setState({
        [theirClientSignalBrokerId]: theirReadOnlyState,
      });
      // }
    }
  }

  // TODO: Document
  handlePeerSharedStateUpdated(virtualServerZenRTCPeer) {
    this.sync(virtualServerZenRTCPeer);
  }

  // TODO: Document
  handlePeerDisconnect(virtualServerZenRTCPeer) {
    this.sync(virtualServerZenRTCPeer);
  }
}
