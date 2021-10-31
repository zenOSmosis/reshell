import Padding from "@components/Padding";
import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import AutoScaler from "@components/AutoScaler";
import ButtonPanel from "@components/ButtonPanel";
import VirtualLink from "@components/VirtualLink";
import NoWrap from "@components/NoWrap";

import Details from "./views/Details";
import Resources from "./views/Resources";

import getCopyright from "@utils/getCopyright";

// TODO: Include ReShell documentation here, as well as architecture overview

// TODO: Include property for "about" view (per app), where its rendered HTML can be utilized for SEO purposes

// TODO: Include license link type: https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types

// TODO: Include links to PhantomCore, MediaStreamController, Speaker.app, zenOSmosis, GitHub, etc.

// TODO: Include "declarative API" (it is React, but the components themselves
// do their base to abstract away logic w/ their opinionated internal handling,
// while trying to stay very performant themselves)

export const REGISTRATION_ID = "about-reshell";

const AboutReShell = {
  id: REGISTRATION_ID,
  title: "About ReShell",
  style: {
    width: 640,
    height: 480,
  },
  initialSharedState: {
    screen: "overview",
  },
  titleBarView: function TitleBarView({ sharedState, setSharedState }) {
    /*
    const handleSetSearchQuery = useCallback(
      evt => setSharedState({ searchQuery: evt.target.value }),
      [setSharedState]
    );

    const handleDoubleClick = useCallback(
      evt => {
        // Prevent double-clicks from resizing the window if there is text in
        // the search bar
        if (Boolean(sharedState.searchQuery)) {
          evt.stopPropagation();
        }
      },
      [sharedState]
    );
    */

    return (
      <Padding>
        <ButtonPanel
          // Force update if the screen changes
          key={sharedState.screen}
          buttons={[
            {
              content: "Overview",
              onClick: () => setSharedState({ screen: "overview" }),
              isSelected: sharedState.screen === "overview",
            },
            {
              content: "Details",
              onClick: () => setSharedState({ screen: "details" }),
              isSelected: sharedState.screen === "details",
            },
            {
              content: "Resources",
              onClick: () => setSharedState({ screen: "resources" }),
              isSelected: sharedState.screen === "resources",
            },
          ]}
        />
      </Padding>
    );
  },
  view: function View({ sharedState, setSharedState }) {
    return (
      <Padding>
        <Layout>
          <Content>
            {sharedState.screen === "overview" && (
              <AutoScaler>
                <Center>
                  <div style={{ fontSize: "8rem", fontStyle: "italic" }}>
                    ReShell
                  </div>
                  <NoWrap style={{ fontSize: "1.5rem" }}>
                    App layout framework and UI services engine
                  </NoWrap>
                </Center>
              </AutoScaler>
            )}

            {sharedState.screen === "details" && <Details />}

            {sharedState.screen === "resources" && <Resources />}
          </Content>
          <Footer style={{ textAlign: "center" }}>
            {sharedState.screen === "overview" && (
              <p>
                <VirtualLink
                  onClick={() => setSharedState({ screen: "details" })}
                >
                  Details
                </VirtualLink>{" "}
                |{" "}
                <VirtualLink
                  onClick={() => setSharedState({ screen: "resources" })}
                >
                  Resources
                </VirtualLink>
              </p>
            )}

            <div style={{ opacity: 0.5 }}>{getCopyright()}</div>

            {/*
              <div style={{ padding: 4 }}>
               Get
              started with{" "}
              {
                // TODO: Make link
              }
              <span style={{ color: "orange", textDecoration: "underline" }}>
                wrapping your app with ReShell
              </span>
              .
            </div>
              */}
          </Footer>
        </Layout>
      </Padding>
    );
  },
};

export default AboutReShell;
