import PhantomCore from "phantom-core";
import StorageEngine from "./StorageEngine";
import SecureLS from "secure-ls";

export default class SecureLocalStorageEngine extends StorageEngine {
  constructor(options) {
    const DEFAULT_OPTIONS = {
      encryptionType: "aes",
    };

    super(PhantomCore.mergeOptions(DEFAULT_OPTIONS, options));

    // @see https://github.com/softvar/secure-ls
    this._ls = new SecureLS({ encodingType: this.getEncryptionType() });

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
    // Fix issue where empty string is returned if key is not available
    const keys = this._ls.getAllKeys();
    if (!keys.includes(key)) {
      return undefined;
    }

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
