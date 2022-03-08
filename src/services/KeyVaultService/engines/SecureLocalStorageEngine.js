import PhantomCore from "phantom-core";
import BaseStorageEngine, { EVT_UPDATED } from "./_BaseStorageEngine";
import SecureLS from "secure-ls";

// TODO: Document
export default class SecureLocalStorageEngine extends BaseStorageEngine {
  constructor(options) {
    const DEFAULT_OPTIONS = {
      encryptionType: "AES",
    };

    super(PhantomCore.mergeOptions(DEFAULT_OPTIONS, options));

    // @see https://github.com/softvar/secure-ls
    this._ls = new SecureLS({ encodingType: this.getEncryptionType() });

    this.setTitle("SecureLocalStorageEngine");
  }

  // TODO: Document
  async setItem(key, value) {
    this._ls.set(key, value);

    this.emit(EVT_UPDATED);
  }

  // TODO: Document
  async removeItem(key) {
    this._ls.remove(key);

    this.emit(EVT_UPDATED);
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

    this.emit(EVT_UPDATED);
  }
}
