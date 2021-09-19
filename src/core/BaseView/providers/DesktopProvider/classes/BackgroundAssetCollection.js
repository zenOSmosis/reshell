import { PhantomCollection, EVT_UPDATED, EVT_DESTROYED } from "phantom-core";

export { EVT_UPDATED, EVT_DESTROYED };

export default class BackgroundAssetCollection extends PhantomCollection {
  // TODO: Document
  addBackgroundAsset(backgroundAsset) {
    return this.addChild(backgroundAsset);
  }

  // TODO: Document
  removeBackgroundAsset(backgroundAsset) {
    return this.removeChild(backgroundAsset);
  }

  // TODO: Document
  getBackgroundAssets() {
    return this.getChildren();
  }
}
