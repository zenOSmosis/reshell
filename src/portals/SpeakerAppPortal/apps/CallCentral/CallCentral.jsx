import Layout, { Header, Content, Footer } from "@components/Layout";
import Center from "@components/Center";

const CallCentral = {
  id: "call-central",
  title: "Call Central",
  style: {
    left: "auto",
    bottom: 0,
    width: 640,
    height: 480,
  },
  view: function View() {
    return (
      <Layout>
        <Header>[options]</Header>
        <Content>
          <Center canOverflow={true}>[networks]</Center>
        </Content>
        <Footer>[settings / etc]</Footer>
      </Layout>
    );
  },
};

export default CallCentral;
