import Layout, { Header, Content, Footer } from "@components/Layout";
import Center from "@components/Center";

const CallCentralStation = {
  id: "call-central-station",
  title: "Call Central Station",
  style: {
    left: 10,
    top: 20,
    width: 640,
    height: 480,
  },
  isAutoStart: true,
  view: function View() {
    return (
      <Layout>
        <Header>[profile] [networks] [create network] [private network]</Header>
        <Content>
          <Center canOverflow={true}>[public networks]</Center>
        </Content>
        <Footer>[configure audio]</Footer>
      </Layout>
    );
  },
};

export default CallCentralStation;
