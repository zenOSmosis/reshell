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
   * @return {void}
   */
  sync() {
    // Batch remote updates so that we update ours in a single run
    const batchPeersUpdate = {};

    for (const zenRTCPeer of this.getChildren()) {
      const readOnlySyncObject = zenRTCPeer.getReadOnlySyncObject();
      const clientSignalBrokerId = zenRTCPeer.getClientSignalBrokerId();

      const isPeerConnected = zenRTCPeer.getIsConnected();

      // FIXME: (jh) Perform any state structure updating here, unless we
      // want every peer to be aware of every other peer's shared state
      const readOnlyState = isPeerConnected && readOnlySyncObject.getState();

      // TODO: Remove
      console.log(
        "length incoming media streams",
        zenRTCPeer.getIncomingMediaStreams().length
      );

      if (isPeerConnected) {
        batchPeersUpdate[clientSignalBrokerId] = {
          ...readOnlyState,
          media: zenRTCPeer
            .getIncomingMediaStreams()
            .map(({ id }) => id)
            .join(","),
        };
      } else {
        // Delete the shared client state
        //
        // TODO: Fix issue where setting undefined does not sync the hash across the wire
        // @see https://github.com/zenOSmosis/sync-object/issues/40
        batchPeersUpdate[clientSignalBrokerId] = null;
      }
    }

    // FIXME: (jh) If moving to shared writable, only write the shared
    for (const zenRTCPeer of this.getChildren()) {
      const writeableSyncObject = zenRTCPeer.getWritableSyncObject();

      writeableSyncObject.setState({
        peers: batchPeersUpdate,
      });
    }
  }

  // TODO: Document
  handlePeerIncomingMediaStreamsUpdated(virtualServerZenRTCPeer) {
    this.sync(virtualServerZenRTCPeer);
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
