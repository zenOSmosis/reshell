import FullViewport from "@components/FullViewport";

import Center from "@components/Center";

import ParadigmProvider from "./providers/ParadigmProvider";
import UIServicesProvider from "./providers/UIServicesProvider";
import AppRegistrationsProvider from "./providers/AppRegistrationsProvider";
import AppRuntimesProvider from "./providers/AppRuntimesProvider";
import DesktopProvider from "./providers/DesktopProvider";
import React from "react";

// TODO: Document and add prop-types
export default function PortalWrapperView({ portal }) {
  const PortalView = portal;
  return (
    <FullViewport>
      <ParadigmProvider>
        <UIServicesProvider>
          <AppRegistrationsProvider>
            <AppRuntimesProvider>
              <DesktopProvider>
                <React.Suspense fallback={<Center>Loading portal...</Center>}>
                  <PortalView />
                </React.Suspense>
              </DesktopProvider>
            </AppRuntimesProvider>
          </AppRegistrationsProvider>
        </UIServicesProvider>
      </ParadigmProvider>
    </FullViewport>
  );
}
