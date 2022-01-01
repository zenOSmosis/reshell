import { deepMerge } from "phantom-core";
import UIServiceCore from "@core/classes/UIServiceCore";
import KeyVaultService from "./KeyVaultService";

import { utils } from "media-stream-track-controller";

const KEY_STORAGE_ENGINE_MEDIA_DEVICES = "media-devices";

const KEY_DMETA_DEVICE = "device";
const KEY_DMETA_USER_METADATA = "userMetadata";

/**
 * Manages arbitrary associative information for media devices.
 */
export default class MediaDeviceCachingService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setState({
      devicesWithUserMetadata: [],
    });

    this.setTitle("Media Device Caching Service");

    this._storageEngine =
      this.useServiceClass(KeyVaultService).getSecureLocalStorageEngine();

    // Set initial state from local storage
    (async () => {
      this._fetchCachedMediaDeviceUserMetadata().then(devicesWithUserMetadata =>
        this.setState({ devicesWithUserMetadata })
      );
    })();
  }

  /**
   * Adds user-defined information to the given media device.
   *
   * Subsequent calls will deep merge userMetadata with existing metadata.
   *
   * @param {MediaDeviceInfo} device
   * @param {Object} userMetadata
   * @return {Promise<void>}
   */
  async setMediaDeviceUserMetadata(device, userMetadata) {
    if (typeof device !== "object") {
      throw new TypeError("device must be an object");
    }

    if (typeof userMetadata !== "object") {
      throw new TypeError("userMetadata must be an object");
    }

    // Current device (may be overwritten after fetching from cache)
    let update = {
      [KEY_DMETA_DEVICE]: device,
      [KEY_DMETA_USER_METADATA]: userMetadata,
    };

    // Previously cached devices without the current device
    const filteredCache = await this._fetchCachedMediaDeviceUserMetadata().then(
      devicesWithUserMetadata =>
        // Remove matched device from prev
        devicesWithUserMetadata.filter(pred => {
          const isMatch = utils.mediaDevice.getIsSameMediaDevice(
            pred.device,
            device
          );

          if (isMatch) {
            // Deep merge new meta data on top of previous metadata
            update = deepMerge(pred, {
              [KEY_DMETA_USER_METADATA]: userMetadata,
            });
          }

          return !isMatch;
        })
    );

    // This is what will be written back to the local storage cache
    const next = [...filteredCache, update];

    // TODO: Remove
    console.log({ next, filteredCache });

    await this._storageEngine.setItem(KEY_STORAGE_ENGINE_MEDIA_DEVICES, next);

    this.setState({ devicesWithUserMetadata: next });
  }

  /**
   * Fetches stored device information from local storage.
   *
   * @return {Promise<Object>} TODO: Document structure
   */
  async _fetchCachedMediaDeviceUserMetadata() {
    return (
      (await this._storageEngine.fetchItem(KEY_STORAGE_ENGINE_MEDIA_DEVICES)) ||
      []
    );
  }

  /**
   * Retrieves stored device information from local state.
   *
   * NOTE: This does not make a disk call, only reads from memory (current
   * state); it is not intended to be asynchronous
   *
   * @param {MediaDeviceInfo} device
   * @return {Object} TODO: Document structure
   */
  getMediaDeviceUserMetadata(device) {
    const cachedDevice = this.getState().devicesWithUserMetadata.find(pred =>
      utils.mediaDevice.getIsSameMediaDevice(pred.device, device)
    );

    if (cachedDevice) {
      return cachedDevice[KEY_DMETA_USER_METADATA];
    }
  }
}
