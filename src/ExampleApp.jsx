import Layout, { Content, Footer } from "./components/Layout";
import Center from "./components/Center";

export default function ExampleApp() {
  return (
    <Layout style={{ backgroundColor: "#424242", color: "#999" }}>
      <Content>
        <Center>
          <div style={{ fontSize: "18.4vw", fontStyle: "italic" }}>ReShell</div>
          <div style={{ fontSize: "4vw" }}>
            An opinionated, paradigm-switching app mounter
          </div>
        </Center>
      </Content>
      <Footer>
        <div style={{ padding: 4 }}>
          If you are seeing this screen, ReShell is up and running. Get started
          with{" "}
          <a href="#" style={{ color: "orange" }}>
            wrapping your app with ReShell
          </a>
          .
        </div>
      </Footer>
    </Layout>
  );
}
