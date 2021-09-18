import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";

// TODO: Include ability to parse out an HTML file and dynamically link it to
// the public directory during runtime (and during build) for SEO

// TODO: Enable any application to include about info, metadata, so that they
// can be included in SEO

// TODO: Don't automatically initialize ReShell when a search engine is
// detected (i.e. look for various JS properties a search engine might not
// exhibit and test if those capabilities exist in order to determine if a
// search engine or not)

// TODO: Try to not get too fancy with SEO pages, and keep them mostly HTML,
// with JS assets sprinkled in to be able to open relevant parts of ReShell
// when needed, if it is not automatically initialized

const AboutReShell = {
  id: "about-reshell",
  title: "About ReShell",
  style: {
    left: "auto",
    bottom: 0,
    width: 640,
    height: 480,
  },
  view: function View() {
    return (
      <Layout style={{ backgroundColor: "#424242", color: "#999" }}>
        <Content>
          <Center>
            <div style={{ fontSize: "8rem", fontStyle: "italic" }}>ReShell</div>
            <div style={{ fontSize: "1.5rem" }}>
              An opinionated, paradigm-switching app mounter
            </div>
          </Center>
        </Content>
        <Footer>
          <div style={{ padding: 4 }}>
            If you are seeing this screen, ReShell is up and running. Get
            started with{" "}
            {
              // TODO: Make link
            }
            <span style={{ color: "orange", textDecoration: "underline" }}>
              wrapping your app with ReShell
            </span>
            .
          </div>
        </Footer>
      </Layout>
    );
  },
};

export default AboutReShell;
