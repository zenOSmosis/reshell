import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";

const AboutReshellWindow = {
  id: "about-reshell",
  title: "ReShell",
  style: {
    left: "auto",
    bottom: 0,
    width: 640,
    height: 480,
  },
  view: () => (
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
          If you are seeing this screen, ReShell is up and running. Get started
          with{" "}
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
  ),
};

export default AboutReshellWindow;
