import BaseStorageEngine, { EVT_UPDATED } from "./_BaseStorageEngine";

export default class SessionStorageEngine extends BaseStorageEngine {
  constructor(...args) {
    super(...args);

    this.setTitle("SessionStorageEngine");

    // TODO: Implement ability to accept object data or other data types and
    // perform serialization/ unserialization here directly (look at secure-ls
    // handling for clues for some potential approaches )
  }

  // TODO: Document
  async setItem(key, value) {
    window.sessionStorage.setItem(key, value);

    this.emit(EVT_UPDATED);
  }

  // TODO: Document
  async removeItem(key) {
    window.sessionStorage.removeItem(key);

    this.emit(EVT_UPDATED);
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

    this.emit(EVT_UPDATED);
  }
}
