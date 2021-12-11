import SyncObject, { EVT_UPDATED, EVT_DESTROYED } from "sync-object";

export { EVT_UPDATED, EVT_DESTROYED };

export default class PhantomPeerSyncObject extends SyncObject {
  /**
   * @param {Object} rest? [optional; default = {}]
   */
  constructor(rest = {}) {
    super({
      avatarURL: null,
      description: null,
      detectedDevice: {},
      deviceAddress: null,
      isMuted: true,
      media: "",
      ...rest,
    });
  }

  // TODO: Include helper methods to obtain media stream tracks, etc. based off of media object
}
