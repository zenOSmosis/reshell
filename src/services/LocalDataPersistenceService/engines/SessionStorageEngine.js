import StorageEngine from "./StorageEngine";

export default class SessionStorageEngine extends StorageEngine {
  // TODO: Document
  async setItem(key, value) {
    return window.sessionStorage.setItem(key, value);
  }

  // TODO: Document
  async removeItem(key) {
    return window.sessionStorage.removeItem(key);
  }

  // TODO: Document
  async fetchItem(key) {
    return window.sessionStorage.getItem(key);
  }

  // TODO: Document
  async fetchKeys() {
    return Object.keys(window.sessionStorage);
  }

  // TODO: Document
  async clear() {
    window.sessionStorage.clear();
  }
}
