import PhantomCore from "phantom-core";

export default class StorageEngine extends PhantomCore {
  // TODO: Document
  async addItem(key, value) {
    throw new ReferenceError("addItem must be overridden");
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
