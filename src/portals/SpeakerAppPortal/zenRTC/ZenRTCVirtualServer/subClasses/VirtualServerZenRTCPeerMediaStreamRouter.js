import { PhantomCollection } from "phantom-core";
import VirtualServerZenRTCPeer from "./VirtualServerZenRTCPeer";

export default class VirtualServerZenRTCPeerMediaStreamRouter extends PhantomCollection {
  addChild(virtualServerZenRTCPeer) {
    if (!(virtualServerZenRTCPeer instanceof VirtualServerZenRTCPeer)) {
      throw new TypeError(
        "virtualServerZenRTCPeer is not a VirtualServerZenRTCPeer instance"
      );
    }

    super.addChild(virtualServerZenRTCPeer);

    // Route other peer's media streams to this one
    (() => {
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
    })();
  }

  // TODO: Document
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

  // TODO: Document
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

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    this.destroyAllChildren();

    return super.destroy();
  }
}
