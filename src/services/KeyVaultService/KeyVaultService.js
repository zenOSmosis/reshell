import { PhantomCollection, EVT_UPDATED } from "phantom-core";
import UIServiceCore from "@core/classes/UIServiceCore";

import BaseStorageEngine from "./engines/_BaseStorageEngine";
import SessionStorageEngine from "./engines/SessionStorageEngine";
import SecureLocalStorageEngine from "./engines/SecureLocalStorageEngine";

// TODO: [max size estimate; no Safari support!] https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate

// Additional reading: https://web.dev/storage-for-the-web/

// Potential storage backends:
// - https://github.com/willgm/web-crypto-storage
// - https://www.npmjs.com/package/secure-ls

export default class KeyVaultService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Key Vault Service");

    this.setState({
      /** @type {Array<key: string, storageEngine: BaseStorageEngine>[]} */
      keyStorageEngineMaps: [],
    });

    this._storageEngineCollection = this.bindCollectionClass(
      StorageEngineCollection
    );

    // Cache the collection key / storage engine maps to the instance state so
    // that any attached UIs will know to update
    this._storageEngineCollection.on(EVT_UPDATED, async () => {
      const keyStorageEngineMaps = await this._fetchKeyStorageEngineMaps();

      // Cache the key / storage engine maps
      this.setState({ keyStorageEngineMaps });
    });

    this.addStorageEngineClass(SessionStorageEngine);
    this.addStorageEngineClass(SecureLocalStorageEngine);
  }

  /**
   * Retrieves the cached key / storage engine maps from the service state.
   *
   * @return {Array<key: string, storageEngine: BaseStorageEngine>[]}
   */
  getKeyStorageEngineMaps() {
    return this.getState().keyStorageEngineMaps;
  }

  /**
   * Retrieves key / storage engine maps via a new calculation.
   *
   * @return {Array<key: string, storageEngine: BaseStorageEngine>[]}
   */
  async _fetchKeyStorageEngineMaps() {
    const storageEngines = this._storageEngineCollection.getStorageEngines();

    const keyStorageEngineMaps = [];

    for (const storageEngine of storageEngines) {
      const keys = await storageEngine.fetchKeys();

      // TODO: Refactor as part of PhantomCore API (i.e. storageEngine.getClass())
      // const StorageEngineClass = storageEngine.constructor;

      for (const key of keys) {
        keyStorageEngineMaps.push([key, storageEngine]);
      }
    }

    return keyStorageEngineMaps;
  }

  // TODO: Implement optional filtering
  /**
   * Fetches all keys from all connected storage engines.
   *
   * @return {any[]}
   */
  async _fetchKeys() {
    return (await this._fetchKeyStorageEngineMaps()).map(
      keyStorageEngineMaps => keyStorageEngineMaps[0]
    );
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
  getStorageEngineWithShortUUID(shortUUID) {
    return this.getStorageEngines().find(
      predicate => predicate.getShortUUID() === shortUUID
    );
  }

  // TODO: Document
  getSecureLocalStorageEngine() {
    return this._storageEngineCollection.getChildWithKey(
      SecureLocalStorageEngine
    );
  }

  // TODO: Document
  getSessionStorageEngine() {
    return this._storageEngineCollection.getChildWithKey(SessionStorageEngine);
  }

  // TODO: Document
  async clearAllStorageEngines() {
    await Promise.all(
      this.getStorageEngines().map(storageEngine => storageEngine.clear())
    );
  }
}

// TODO: Refactor and document
class StorageEngineCollection extends PhantomCollection {
  // TODO: Document
  addChild(StorageEngineClass) {
    if (this.getChildWithKey(StorageEngineClass)) {
      throw new ReferenceError("StorageEngineClass is already registered");
    }

    // TODO: Ensure title is set and unique across instances

    const storageEngine = new StorageEngineClass();

    // FIXME: (jh) Even better would be to check this before instantiation, but
    // I'm not quite sure how to yet
    if (!(storageEngine instanceof BaseStorageEngine)) {
      throw new TypeError("storageEngine is not of StorageEngine type");
    }

    return super.addChild(storageEngine, StorageEngineClass);
  }

  // TODO: Document
  removeChild(storageEngine) {
    if (storageEngine) {
      storageEngine.destroy();
    }

    return super.removeChild(storageEngine);
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
