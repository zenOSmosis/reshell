import PhantomCore from "phantom-core";

// TODO: Look into https://www.npmjs.com/package/localforage for local IndexedDB handling
// TODO: Implement encrypted storage (indexeddb usage as well?)

/**
 * NOTE: All of these methods are async to handle potential network,
 * off-process, or async-based storage engines.
 *
 * To ensure maximum compatibility, extension classes should use the async API
 * as well.
 */
export default class StorageEngine extends PhantomCore {
  // TODO: Document
  async setItem(key, value) {
    throw new ReferenceError("setItem must be overridden");
  }

  // TODO: Document
  async removeItem(key) {
    throw new ReferenceError("removeItem must be overridden");
  }

  // TODO: Document
  async fetchItem(key) {
    throw new ReferenceError("fetchItem must be overridden");
  }

  // TODO: Document
  async fetchKeys() {
    throw new ReferenceError("fetchKeys must be overridden");
  }

  // TODO: Document
  async clear() {
    throw new ReferenceError("clear must be overridden");
  }
}
