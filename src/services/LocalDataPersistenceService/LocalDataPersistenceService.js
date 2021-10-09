import { PhantomCollection, EVT_UPDATED } from "phantom-core";
import UIServiceCore from "@core/classes/UIServiceCore";
import StorageEngine from "./engines/StorageEngine";
import SessionStorageEngine from "./engines/SessionStorageEngine";

// TODO: [max size estimate; no Safari support!] https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate

// Additional reading: https://web.dev/storage-for-the-web/

// Potential storage backends:
// - https://github.com/willgm/web-crypto-storage
// - https://www.npmjs.com/package/secure-ls

export default class LocalDataPersistenceService extends UIServiceCore {
  constructor() {
    super();

    this.setTitle("Local Data Persistence Service");

    this._storageEngineCollection = new StorageEngineCollection();

    // Proxy storage engine collection EVT_UPDATED events through this instance
    this.proxyOn(this._storageEngineCollection, EVT_UPDATED, (...args) =>
      this.emit(EVT_UPDATED, ...args)
    );

    this.addStorageEngineClass(SessionStorageEngine);
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    await this._storageEngineCollection.destroy();

    return super.destroy();
  }

  // TODO: Document
  // TODO: TODO: Implement optional filtering
  async fetchKeyMaps() {
    const storageEngines = this._storageEngineCollection.getStorageEngines();

    const keyMaps = [];

    for (const storageEngine of storageEngines) {
      const keys = await storageEngine.fetchKeys();

      // TODO: Refactor as part of PhantomCore API (i.e. storageEngine.getClass())
      const StorageEngineClass = storageEngine.constructor;

      for (const key of keys) {
        keyMaps.push([key, StorageEngineClass]);
      }
    }

    return keyMaps;
  }

  // TODO: Implement optional filtering
  /**
   * Fetches all keys from all connected storage engines.
   *
   * @return {any[]}
   */
  async fetchKeys() {
    return (await this.fetchKeyMaps()).map(keyMap => keyMap[0]);
  }

  // TODO: Document
  addStorageEngineClass(StorageEngineClass) {
    this._storageEngineCollection.addStorageEngineClass(StorageEngineClass);
  }

  // TODO: Document
  removeStorageEngineClass(StorageEngineClass) {
    this._storageEngineCollection.removeStorageEngineClass(StorageEngineClass);
  }

  // TODO: Document
  getStorageEngines() {
    return this._storageEngineCollection.getChildren();
  }

  // TODO: Document
  getSessionStorageEngine() {
    return this._storageEngineCollection.getChildWithKey(SessionStorageEngine);
  }
}

class StorageEngineCollection extends PhantomCollection {
  // TODO: Document
  addChild(StorageEngineClass) {
    if (this.getChildWithKey(StorageEngineClass)) {
      throw new ReferenceError("StorageEngineClass is already registered");
    }

    const storageEngine = new StorageEngineClass();

    // FIXME: (jh) Even better would be to check this before instantiation, but
    // I'm not quite sure how to yet
    if (!(storageEngine instanceof StorageEngine)) {
      throw new TypeError("storageEngine is not of StorageEngine type");
    }

    return super.addChild(storageEngine, StorageEngineClass);
  }

  removeChild(StorageEngineClass) {
    const storageEngine = this.getChildWithKey(StorageEngineClass);

    if (storageEngine) {
      storageEngine.destroy();
    }
  }

  // TODO: Document
  addStorageEngineClass(StorageEngineClass) {
    return this.addChild(StorageEngineClass);
  }

  // TODO: Document
  removeStorageEngineClass(StorageEngineClass) {
    return this.removeChild(StorageEngineClass);
  }

  // TODO: Document
  getStorageEngines() {
    return this.getChildren();
  }
}
