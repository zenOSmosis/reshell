import SyncObject, { EVT_UPDATED, EVT_DESTROYED } from "sync-object";

export { EVT_UPDATED, EVT_DESTROYED };

export const STATE_KEY_AVATAR_URL = "avatarURL";
export const STATE_KEY_NAME = "name";
export const STATE_KEY_DESCRIPTION = "description";
export const STATE_KEY_DETECTED_DEVICE = "detectedDevice";
export const STATE_KEY_DEVICE_ADDRESS = "deviceAddress";
export const STATE_KEY_IS_MUTED = "isMuted";
export const STATE_KEY_MEDIA = "media";

export default class PhantomPeerSyncObject extends SyncObject {
  /**
   * @param {Object} initialState? [optional; default = {}]
   */
  constructor(initialState = {}) {
    // TODO: Implement ability to determine local time / offset?

    super({
      [STATE_KEY_AVATAR_URL]: null,
      [STATE_KEY_NAME]: null,
      [STATE_KEY_DESCRIPTION]: null,
      [STATE_KEY_DETECTED_DEVICE]: {},
      [STATE_KEY_DEVICE_ADDRESS]: null,
      [STATE_KEY_IS_MUTED]: true,
      [STATE_KEY_MEDIA]: "",
      ...initialState,
    });
  }

  /**
   * @return {string | null}
   */
  getDeviceAddress() {
    return this.getState()[STATE_KEY_DEVICE_ADDRESS];
  }

  /**
   * @return {string | null}
   */
  getAvatarURL() {
    return this.getState()[STATE_KEY_AVATAR_URL];
  }

  /**
   * @return {string | null}
   */
  getProfileName() {
    return this.getState()[STATE_KEY_NAME];
  }

  /**
   * @return {string | null}
   */
  getProfileDescription() {
    return this.getState()[STATE_KEY_DESCRIPTION];
  }

  /**
   * MediaStream IDs which the peer is sending.
   *
   * IMPORTANT: If this is a remote peer, this represents the MediaStream IDs
   * which the remote peer is sending (not streams which the local is sending
   * to the remote).
   *
   * @return {string[]}
   */
  getOutgoingMediaStreamIds() {
    return this.getState()
      [STATE_KEY_MEDIA].split(",")
      .map(id => id.trim());
  }

  /**
   * MediaStream instances which the peer is sending.
   *
   * IMPORTANT: If this is a remote peer, this represents the MediaStream
   * instances which the remote peer is sending (not streams which the local is
   * sending to the remote).
   *
   * @return {MediaStream[]}
   */
  getOutgoingMediaStreams() {
    throw new ReferenceError("getOutgoingMediaStreams must be overridden");
  }
  /**
   * MediaStreamTracks which the peer is sending.
   *
   * IMPORTANT: If this is a remote peer, this represents the MediaStreamTrack
   * instances which the remote peer is sending (not streams which the local is
   * sending to the remote).
   *
   * @return {MediaStreamTrack[]}
   */
  getOutgoingMediaStreamTracks() {
    return this.getOutgoingMediaStreams()
      .map(mediaStream => mediaStream.getTracks())
      .flat();
  }
}
