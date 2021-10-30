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
  constructor(options = {}) {
    const DEFAULT_OPTIONS = { encryptionType: null };

    super(
      PhantomCore.mergeOptions({
        DEFAULT_OPTIONS,
        ...PhantomCore.mergeOptions({
          ...options,
          isAsync: false,
        }),
      })
    );

    // IMPORTANT: The encryption type is left up to the storage engine itself
    // to implement; this only contains its type
    this._encryptionType = this.getOptions().encryptionType;
  }

  // TODO: Document
  getEncryptionType() {
    return this._encryptionType;
  }

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
