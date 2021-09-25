import Layout, { Header, Content, Footer } from "@components/Layout";
import Center from "@components/Center";

const VirtualServer = {
  id: "virtual-server",
  title: "Virtual Server",
  style: {
    width: 640,
    height: 480,
  },
  view: function View() {
    return (
      <Layout>
        <Header>[options]</Header>
        <Content>
          <Center canOverflow={true}>[create a network]</Center>
        </Content>
        <Footer>[settings / etc]</Footer>
      </Layout>
    );
  },
};

export default VirtualServer;
