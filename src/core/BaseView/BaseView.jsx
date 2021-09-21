import { useEffect, useState } from "react";
import FullViewport from "@components/FullViewport";

import ParadigmProvider from "./providers/ParadigmProvider";
import UIServicesProvider from "./providers/UIServicesProvider";
import AppRegistrationsProvider from "./providers/AppRegistrationsProvider";
import AppRuntimesProvider from "./providers/AppRuntimesProvider";
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
    <FullViewport>
      <ParadigmProvider>
        <UIServicesProvider>
          <AppRegistrationsProvider>
            <AppRuntimesProvider>
              <DesktopProvider>
                <PortalView />
              </DesktopProvider>
            </AppRuntimesProvider>
          </AppRegistrationsProvider>
        </UIServicesProvider>
      </ParadigmProvider>
    </FullViewport>
  );
}
