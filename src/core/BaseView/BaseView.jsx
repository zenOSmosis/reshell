import { useEffect, useState } from "react";
import FullViewport from "@components/FullViewport";

import ParadigmProvider from "./providers/ParadigmProvider";
import UIServicesProvider from "./providers/UIServicesProvider";
import DesktopProvider from "./providers/DesktopProvider";

// TODO: Document and add prop-types
export default function BaseView({ portal }) {
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

  const PortalView = portal;
  return (
    <ParadigmProvider>
      <UIServicesProvider>
        <DesktopProvider>
          <FullViewport>
            <PortalView />
          </FullViewport>
        </DesktopProvider>
      </UIServicesProvider>
    </ParadigmProvider>
  );
}
