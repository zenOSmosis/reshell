import { PhantomCollection } from "phantom-core";
import VirtualServerZenRTCPeer from "../VirtualServerZenRTCPeer";

/**
 * Performs media stream routing for all of the peers.
 */
export default class VirtualServerZenRTCPeerMediaStreamRouter extends PhantomCollection {
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

  /**
   * Performs a full media stream track sync from the given peer to / from the
   * other peers.
   *
   * @param {VirtualServerZenRTCPeer} virtualServerZenRTCPeer
   * @return {void}
   */
  fullSync(virtualServerZenRTCPeer) {
    const otherPeers = this.getChildren().filter(
      pred => pred !== virtualServerZenRTCPeer
    );

    const outgoingMediaStreams =
      virtualServerZenRTCPeer.getOutgoingMediaStreams();

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
  }

  /**
   * Sends a media stream track to the other peers except for the given
   * VirtualServerZenRTCPeer.
   *
   * @param {VirtualServerZenRTCPeer} virtualServerZenRTCPeer
   * @param {MediaStreamTrack} mediaStreamTrack
   * @param {MediaStream} mediaStream
   */
  addOutgoingMediaStreamTrack(
    virtualServerZenRTCPeer,
    mediaStreamTrack,
    mediaStream
  ) {
    const otherPeers = this.getChildren().filter(
      pred => pred !== virtualServerZenRTCPeer
    );

    for (const otherPeer of otherPeers) {
      otherPeer.addOutgoingMediaStreamTrack(mediaStreamTrack, mediaStream);
    }
  }

  /**
   * Removes a media stream track from the other peers except for the given
   * VirtualServerZenRTCPeer.
   *
   * @param {VirtualServerZenRTCPeer} virtualServerZenRTCPeer
   * @param {MediaStreamTrack} mediaStreamTrack
   * @param {MediaStream} mediaStream
   */
  removeOutgoingMediaStreamTrack(
    virtualServerZenRTCPeer,
    mediaStreamTrack,
    mediaStream
  ) {
    const otherPeers = this.getChildren().filter(
      pred => pred !== virtualServerZenRTCPeer
    );

    for (const otherPeer of otherPeers) {
      otherPeer.removeOutgoingMediaStreamTrack(mediaStreamTrack, mediaStream);
    }
  }
}
