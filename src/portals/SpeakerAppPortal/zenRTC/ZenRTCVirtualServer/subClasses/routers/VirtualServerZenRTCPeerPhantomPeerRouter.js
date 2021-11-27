import { PhantomCollection } from "phantom-core";
import VirtualServerZenRTCPeer from "../VirtualServerZenRTCPeer";

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

    const writableSyncObject = virtualServerZenRTCPeer.getWritableSyncObject();
    const readOnlySyncObject = virtualServerZenRTCPeer.getReadOnlySyncObject();

    // TODO: Remove
    console.log({
      writableSyncObject: writableSyncObject.getState(),
      readOnlySyncObject: readOnlySyncObject.getState(),
    });

    /*
    for (const otherPeer of otherPeers) {
      // Add the other peers' media streams to this peer
      for (const mediaStream of otherPeer.getIncomingMediaStreams()) {
        for (const mediaStreamTrack of mediaStream.getTracks()) {
          virtualServerZenRTCPeer.addOutgoingMediaStreamTrack(
            mediaStreamTrack,
            mediaStream
          );
        }
      }

      // Route this peer's media streams to the other peers
      for (const mediaStream of outgoingMediaStreams) {
        for (const mediaStreamTrack of mediaStream.getTracks()) {
          this.addOutgoingMediaStreamTrack(
            otherPeer,
            mediaStreamTrack,
            mediaStream
          );
        }
      }
    }
    */
  }

  // TODO: Implement and document
  handlePeerSharedStateUpdated(virtualServerZenRTCPeer, updatedState) {
    // TODO: Remove
    console.log("handleReadOnlyStateUpdate", {
      virtualServerZenRTCPeer,
      updatedState,
    });
  }
}
