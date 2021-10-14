import Padding from "@components/Padding";
import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import AutoScaler from "@components/AutoScaler";

// TODO: Include ReShell documentation here, as well as architecture overview

// TODO: Include in documentation how React providers can be wrapped up in (or
// as) services and dynamically included in the React tree

// TODO: Include license link type: https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types

// TODO: Include links to PhantomCore, MediaStreamController, Speaker.app, zenOSmosis, GitHub, etc.

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
              <p>
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
              </p>
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
