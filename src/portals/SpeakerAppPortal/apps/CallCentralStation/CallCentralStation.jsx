import Layout, { Header, Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import AppLinkButton from "@components/AppLinkButton";

import { REGISTRATION_ID as LOCAL_USER_PROFILE_REGISTRATION_ID } from "../LocalUserProfile";

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
        <Header>
          <AppLinkButton appDescriptorID={LOCAL_USER_PROFILE_REGISTRATION_ID} />
          [networks] [create network] [private network]
        </Header>
        <Content>
          <Center canOverflow={true}>[public networks]</Center>
        </Content>
        <Footer>[configure audio]</Footer>
      </Layout>
    );
  },
};

export default CallCentralStation;
