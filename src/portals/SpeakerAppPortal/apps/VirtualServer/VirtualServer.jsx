import Padding from "@components/Padding";
import Layout, { Header, Content, Footer } from "@components/Layout";
import Center from "@components/Center";
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

    const isHosting = virtualServerService.getIsHosting();

    return (
      <Layout>
        <Header>
          <Padding>
            <AppLinkButton
              id={CALL_CENTRAL_STATION_REGISTRATION_ID}
              title="Networks"
            />
          </Padding>
        </Header>
        <Content>
          {!isHosting ? (
            <NetworkCreatorForm
              // TODO: Refactor
              onSubmit={formData =>
                virtualServerService.createVirtualServer({
                  ...formData,
                  // TODO: Remove hardcoding
                  ...{
                    deviceAddress: 12345,
                    buildHash: 123422,
                    userAgent: "test-user-agent",
                  },
                })
              }
            />
          ) : (
            <Center>
              <button onClick={() => virtualServerService.stopVirtualServer()}>
                Stop
              </button>
            </Center>
          )}
        </Content>
        <Footer>
          <Padding>
            <div style={{ float: "right" }}>
              <LabeledLED
                label="Socket"
                color={socketService.getIsConnected() ? "green" : "gray"}
              />
              <LabeledLED
                label="Hosting"
                color={isHosting ? "green" : "gray"}
              />
            </div>
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default VirtualServer;
