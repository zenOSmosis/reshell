import StorageEngine from "./StorageEngine";

export default class LocalStorageEngine extends StorageEngine {
  constructor(...args) {
    super(...args);

    this.setTitle("LocalStorageEngine");
  }

  // TODO: Document
  async setItem(key, value) {
    return window.localStorage.setItem(key, value);
  }

  // TODO: Document
  async removeItem(key) {
    return window.localStorage.removeItem(key);
  }

  // TODO: Document
  async fetchItem(key) {
    return window.localStorage.getItem(key);
  }

  // TODO: Document
  async fetchKeys() {
    return Object.keys(window.localStorage);
  }

  // TODO: Document
  async clear() {
    window.localStorage.clear();
  }
}
