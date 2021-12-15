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
   * @param {Object} rest? [optional; default = {}]
   */
  constructor(rest = {}) {
    // TODO: Implement ability to determine local time / offset?

    super({
      [STATE_KEY_AVATAR_URL]: null,
      [STATE_KEY_NAME]: null,
      [STATE_KEY_DESCRIPTION]: null,
      [STATE_KEY_DETECTED_DEVICE]: {},
      [STATE_KEY_DEVICE_ADDRESS]: null,
      [STATE_KEY_IS_MUTED]: true,
      [STATE_KEY_MEDIA]: "",
      ...rest,
    });
  }

  // TODO: Include helper methods to obtain media stream tracks, etc. based off of media object
}
