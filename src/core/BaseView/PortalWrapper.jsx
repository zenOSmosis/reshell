import Animation from "@components/Animation";
import Center from "@components/Center";
import Cover from "@components/Cover";
import ParadigmProvider from "../providers/ParadigmProvider";
import UIServicesProvider from "../providers/UIServicesProvider";
import AppOrchestrationProvider from "../providers/AppOrchestrationProvider";
import DesktopProvider from "../providers/DesktopProvider";
import React from "react";

// TODO: Document and add prop-types
export default function PortalWrapperView({ portal }) {
  return (
    <ParadigmProvider>
      <UIServicesProvider>
        <AppOrchestrationProvider>
          <DesktopProvider>
            <React.Suspense
              fallback={
                // NOTE: While Cover works as a FullScreen substitute for
                // simple layouts, it doesn't contain all of the view hacks
                // the regular FullViewport component has.
                //
                // However, it seems that the usage of FullViewport is better
                // left up to the portal view itself rather than the wrapper.
                <Cover>
                  <Center style={{ fontWeight: "bold" }}>
                    Loading portal...
                  </Center>
                </Cover>
              }
            >
              <PortalWrapperTransitionView portal={portal} />
            </React.Suspense>
          </DesktopProvider>
        </AppOrchestrationProvider>
      </UIServicesProvider>
    </ParadigmProvider>
  );
}

// Sub-wrapper for portal view which fades it out
function PortalWrapperTransitionView({
  portal,
  initialBackgroundColor = "#000",
}) {
  const PortalView = portal;

  return (
    <>
      <PortalView />
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
