import Layout, { Header, Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import AppLinkButton from "@components/AppLinkButton";

import { REGISTRATION_ID as CALL_CENTRAL_STATION_REGISTRATION_ID } from "../CallCentralStation";

export const REGISTRATION_ID = "virtual-server";

const VirtualServer = {
  id: REGISTRATION_ID,
  title: "Virtual Server",
  style: {
    width: 640,
    height: 480,
  },
  view: function View() {
    return (
      <Layout>
        <Header>
          <AppLinkButton
            id={CALL_CENTRAL_STATION_REGISTRATION_ID}
            title="Networks"
          />
        </Header>
        <Content>
          <Center canOverflow={true}>[create a network]</Center>
        </Content>
        <Footer>[settings / etc]</Footer>
      </Layout>
    );
  },
};

export default VirtualServer;
