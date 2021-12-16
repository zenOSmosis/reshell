import PhantomPeerSyncObject, {
  EVT_UPDATED,
  EVT_DESTROYED,
  STATE_KEY_AVATAR_URL,
  STATE_KEY_NAME,
  STATE_KEY_DESCRIPTION,
  STATE_KEY_DETECTED_DEVICE,
  STATE_KEY_DEVICE_ADDRESS,
  STATE_KEY_IS_MUTED,
  STATE_KEY_MEDIA,
} from "@portals/SpeakerAppPortal/zenRTC/PhantomPeerSyncObject";

import LocalZenRTCPeer from "../../zenRTC/LocalZenRTCPeer";

export {
  EVT_UPDATED,
  EVT_DESTROYED,
  STATE_KEY_AVATAR_URL,
  STATE_KEY_NAME,
  STATE_KEY_DESCRIPTION,
  STATE_KEY_DETECTED_DEVICE,
  STATE_KEY_DEVICE_ADDRESS,
  STATE_KEY_IS_MUTED,
  STATE_KEY_MEDIA,
};

/**
 * A virtual participant from the perspective of a web browser, or other
 * web-based client device.
 */
export default class RemotePhantomPeerSyncObject extends PhantomPeerSyncObject {
  // TODO: Document
  constructor(initialState = {}, localZenRTCPeer) {
    if (!(localZenRTCPeer instanceof LocalZenRTCPeer)) {
      throw new TypeError("localZenRTCPeer is not a LocalZenRTCPeer instance");
    }

    super(initialState);

    this._localZenRTCPeer = localZenRTCPeer;
  }

  /**
   * MediaStream instances which the peer is sending.
   *
   * @return {MediaStream[]}
   */
  getOutgoingMediaStreams() {
    const mediaStreamTrackIds = this.getOutgoingMediaStreamIds();
    const mediaStreams = this._localZenRTCPeer
      .getIncomingMediaStreams()
      .filter(mediaStream => mediaStreamTrackIds.includes(mediaStream.id));

    return mediaStreams;
  }
}
