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

  /**
   * Fetches all keys from all connected storage engines.
   *
   * @return {any[]}
   */
  async fetchKeys() {
    return await Promise.all(
      this._storageEngineCollection
        .getStorageEngines()
        .map(storageEngine => storageEngine.fetchKeys())
        .flat()
    );
  }

  // TODO: Document
  addStorageEngineClass(storageEngineClass) {
    this._storageEngineCollection.addStorageEngineClass(storageEngineClass);
  }

  // TODO: Document
  removeStorageEngineClass(storageEngineClass) {
    this._storageEngineCollection.removeStorageEngineClass(storageEngineClass);
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
