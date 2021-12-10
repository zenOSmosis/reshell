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
      media: {},
      ...rest,
    });
  }
}
