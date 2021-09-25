import Layout, { Header, Content, Footer } from "@components/Layout";
// import Center from "@components/Center";
import AppLinkButton from "@components/AppLinkButton";
import LabeledLED from "@components/labeled/LabeledLED";

import NetworkCreatorForm from "./views/NetworkCreatorForm";

import { REGISTRATION_ID as CALL_CENTRAL_STATION_REGISTRATION_ID } from "../CallCentralStation";

import SpeakerAppSocketAuthenticationService from "@portals/SpeakerAppPortal/services/SpeakerAppSocketAuthenticationService";
import SpeakerAppVirtualServerControllerService from "@portals/SpeakerAppPortal/services/SpeakerAppVirtualServerControllerService";

export const REGISTRATION_ID = "virtual-server";

const VirtualServer = {
  id: REGISTRATION_ID,
  title: "Virtual Server",
  style: {
    width: 640,
    height: 480,
  },
  serviceClasses: [
    SpeakerAppSocketAuthenticationService,
    SpeakerAppVirtualServerControllerService,
  ],
  view: function View({ appServices }) {
    const socketService = appServices[SpeakerAppSocketAuthenticationService];
    const virtualServerService =
      appServices[SpeakerAppVirtualServerControllerService];

    // TODO: Remove
    console.log({ virtualServerService });

    return (
      <Layout>
        <Header>
          <AppLinkButton
            id={CALL_CENTRAL_STATION_REGISTRATION_ID}
            title="Networks"
          />
        </Header>
        <Content>
          <NetworkCreatorForm />
        </Content>
        <Footer>
          {" "}
          <LabeledLED
            label="Socket"
            color={socketService.getIsConnected() ? "green" : "gray"}
            style={{ float: "right" }}
          />
        </Footer>
      </Layout>
    );
  },
};

export default VirtualServer;
