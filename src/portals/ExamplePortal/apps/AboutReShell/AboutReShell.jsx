import Padding from "@components/Padding";
import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import AutoScaler from "@components/AutoScaler";

// TODO: Include ReShell documentation here, as well as architecture overview

// TODO: Include property for "about" view (per app), where its rendered HTML can be utilized for SEO purposes

// TODO: Include license link type: https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types

// TODO: Include links to PhantomCore, MediaStreamController, Speaker.app, zenOSmosis, GitHub, etc.

// TODO: Include "declarative API" (it is React, but the components themselves
// do their base to abstract away logic w/ their opinionated internal handling,
// while trying to stay very performant themselves)

const AboutReShell = {
  id: "about-reshell",
  title: "About ReShell",
  style: {
    width: 640,
    height: 480,
    backgroundColor: "rgba(42,42,42,.5)",
  },
  view: function View() {
    return (
      <Padding>
        <Layout>
          <Content>
            <AutoScaler>
              <Center>
                <div style={{ fontSize: "8rem", fontStyle: "italic" }}>
                  ReShell
                </div>
                <div style={{ fontSize: "1.5rem" }}>
                  An opinionated, paradigm-switching app mounter
                </div>
              </Center>
            </AutoScaler>
          </Content>
          <Footer>
            <Padding>
              <div>
                This project is a work-in-progress. For contact information,
                visit{" "}
                <a
                  href="https://zenOSmosis.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  zenOSmosis.com
                </a>
                .
              </div>
            </Padding>
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
