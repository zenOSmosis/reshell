import UIServiceCore from "@core/classes/UIServiceCore";
import KeyVaultService from "./KeyVaultService";

// import { utils } from "media-stream-track-controller";

// const { createDefaultAudioConstraints } = utils.constraints;

const KEY_STORAGE_ENGINE_MEDIA_DEVICES = "media-devices";

// TODO: Document
export default class MediaDeviceCachingService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Media Device Caching Service");

    // TODO: Handle caching & associating of devices w/ default constraints, etc.

    this._storageEngine =
      this.useServiceClass(KeyVaultService).getSecureLocalStorageEngine();
  }

  // TODO: Document
  async fetchCachedDevices() {
    // TODO: Implement

    return this._storageEngine.fetchItem(KEY_STORAGE_ENGINE_MEDIA_DEVICES);
  }

  // TODO: Document
  async updateCachedDevices(devices) {
    const prev = await this.fetchCachedDevices();

    // TODO: Merge
    const next = { ...prev, ...devices };

    // TODO: Remove
    console.log({ next, prev });

    await this._storageEngine.setItem(KEY_STORAGE_ENGINE_MEDIA_DEVICES, next);
  }

  // TODO: Document
  async setDeviceDefaultConstraints(device) {
    // TODO: Implement
    // const prev = await this.fetchCachedDevices();
  }

  // TODO: Document
  async fetchDeviceDefaultConstraints(device) {
    // TODO: Implement
  }
}
