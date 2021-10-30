import StorageEngine from "./StorageEngine";
import SecureLS from "secure-ls";

export default class LocalStorageEngine extends StorageEngine {
  constructor(...args) {
    super(...args);

    this._ls = new SecureLS();

    this.setTitle("SecureLocalStorageEngine");
  }

  // TODO: Document
  async setItem(key, value) {
    return this._ls.set(key, value);
  }

  // TODO: Document
  async removeItem(key) {
    return this._ls.remove(key);
  }

  // TODO: Document
  async fetchItem(key) {
    try {
      return this._ls.get(key);
    } catch (err) {
      console.error(err);
    }
  }

  // TODO: Document
  async fetchKeys() {
    return this._ls.getAllKeys();
  }

  // TODO: Document
  async clear() {
    this._ls.clear();
  }
}
