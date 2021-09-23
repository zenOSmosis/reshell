import { useCallback, useEffect, useState } from "react";
import BackgroundAssetCollection, {
  EVT_UPDATED,
  EVT_DESTROYED,
} from "../classes/BackgroundAssetCollection";

export default function useBackgroundAssetCollection() {
  const [assetCollection, setAssetCollection] = useState(null);
  const [backgroundAssets, setBackgroundAssets] = useState([]);

  useEffect(() => {
    const assetCollection = new BackgroundAssetCollection();

    setAssetCollection(assetCollection);

    assetCollection.once(EVT_DESTROYED, () => {
      setAssetCollection(null);
    });

    setBackgroundAssets(assetCollection.getBackgroundAssets());
    assetCollection.on(EVT_UPDATED, () =>
      setBackgroundAssets(assetCollection.getBackgroundAssets())
    );

    return function unmount() {
      assetCollection.destroy();
    };
  }, []);

  // TODO: Document
  const addBackgroundAsset = useCallback(
    backgroundAsset => assetCollection.addBackgroundAsset(backgroundAsset),
    [assetCollection]
  );

  // TODO: Document
  const removeBackgroundAsset = useCallback(
    backgroundAsset => assetCollection.removeBackgroundAsset(backgroundAsset),
    [assetCollection]
  );

  return {
    backgroundAssets,
    addBackgroundAsset,
    removeBackgroundAsset,
  };
}
