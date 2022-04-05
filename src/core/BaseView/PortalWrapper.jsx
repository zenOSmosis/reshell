import Animation from "@components/Animation";
import Cover from "@components/Cover";
import UIServicesProvider from "../providers/UIServicesProvider";
import AppOrchestrationServiceProvider from "../providers/AppOrchestrationServiceProvider";
import DesktopServiceProvider from "../providers/DesktopServiceProvider";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import PortalLoadingIndicator from "./PortalLoadingIndicator";

// TODO: Document and add prop-types
export default function PortalWrapperView({ portal }) {
  return (
    <Router>
      <UIServicesProvider>
        <AppOrchestrationServiceProvider>
          <DesktopServiceProvider>
            <React.Suspense
              fallback={
                // NOTE: While Cover works as a FullScreen substitute for
                // simple layouts, it doesn't contain all of the view hacks
                // the regular FullViewport component has.
                //
                // However, it seems that the usage of FullViewport is better
                // left up to the portal view itself rather than the wrapper.
                <Cover>
                  <PortalLoadingIndicator />
                </Cover>
              }
            >
              <PortalWrapperTransitionView portal={portal} />
            </React.Suspense>
          </DesktopServiceProvider>
        </AppOrchestrationServiceProvider>
      </UIServicesProvider>
    </Router>
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

      {
        // Fade-out overlay view for fade-in effect
      }
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
