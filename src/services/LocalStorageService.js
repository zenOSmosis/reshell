import { PhantomCollection } from "phantom-core";
import UIServiceCore from "@core/classes/UIServiceCore";

// TODO: [max size estimate; no Safari support!] https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate

// Additional reading: https://web.dev/storage-for-the-web/

// Potential storage backends:
// - https://github.com/willgm/web-crypto-storage
// - https://www.npmjs.com/package/secure-ls

// TODO: Build out
class PersistentStorageBackendCollection extends PhantomCollection {}

export default class LocalStorageService extends UIServiceCore {
  constructor() {
    super();

    this.bindCollectionClass(PersistentStorageBackendCollection);
  }
}
