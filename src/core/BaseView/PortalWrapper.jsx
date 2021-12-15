import FullViewport from "@components/FullViewport";

import Animation from "@components/Animation";
import Center from "@components/Center";
import Cover from "@components/Cover";
import ParadigmProvider from "./providers/ParadigmProvider";
import UIServicesProvider from "./providers/UIServicesProvider";
import AppRegistrationsProvider from "./providers/AppRegistrationsProvider";
import AppRuntimesProvider from "./providers/AppRuntimesProvider";
import DesktopProvider from "./providers/DesktopProvider";
import React from "react";

// TODO: Document and add prop-types
export default function PortalWrapperView({ portal }) {
  return (
    <FullViewport>
      <ParadigmProvider>
        <UIServicesProvider>
          <AppRegistrationsProvider>
            <AppRuntimesProvider>
              <DesktopProvider>
                <React.Suspense
                  fallback={
                    <Center style={{ fontWeight: "bold" }}>
                      Loading portal...
                    </Center>
                  }
                >
                  <FadeOutPortalView portal={portal} />
                </React.Suspense>
              </DesktopProvider>
            </AppRuntimesProvider>
          </AppRegistrationsProvider>
        </UIServicesProvider>
      </ParadigmProvider>
    </FullViewport>
  );
}

// Sub-wrapper for portal view which fades it out
function FadeOutPortalView({ portal, initialBackgroundColor = "#000" }) {
  const PortalView = portal;

  return (
    <>
      <Cover>
        <PortalView />
      </Cover>
      <Cover
        style={{
          // Enable UI to be usable below cover
          pointerEvents: "none",
        }}
      >
        <Animation
          animationName="fadeOut"
          animationDuration="3s"
          style={{ backgroundColor: initialBackgroundColor }}
        />
      </Cover>
    </>
  );
}
