import { useEffect, useState } from "react";
import FullViewport from "../../FullViewport";

export default function BaseView({ baseApp }) {
  const [areBaseStylesLoaded, setAreBaseStylesLoaded] = useState(false);

  useEffect(() => {
    // Lazy-load BaseView style so it doesn't override before the app is mounted
    //
    // TODO: Use preload
    import("./base-styles.css")
      .then(() => setAreBaseStylesLoaded(true))
      .catch((err) => console.error(err));
  }, []);

  if (!areBaseStylesLoaded) {
    return null;
  }

  const BaseAppView = baseApp;
  return (
    <FullViewport>
      <BaseAppView />
    </FullViewport>
  );
}
