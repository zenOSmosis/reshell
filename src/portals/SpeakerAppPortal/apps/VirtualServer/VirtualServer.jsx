// import { useCallback } from "react";

import Padding from "@components/Padding";
import Layout, { Header, Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import AppLinkButton from "@components/AppLinkButton";
import LabeledLED from "@components/labeled/LabeledLED";

import NetworkCreatorForm from "./views/NetworkCreatorForm";
import HostingView from "./views/HostingView";

import { REGISTRATION_ID as CALL_CENTRAL_STATION_REGISTRATION_ID } from "../CallCentralStation";

import SpeakerAppSocketAuthenticationService from "@portals/SpeakerAppPortal/services/SpeakerAppSocketAuthenticationService";
import SpeakerAppVirtualServerControllerService from "@portals/SpeakerAppPortal/services/SpeakerAppVirtualServerControllerService";

export const REGISTRATION_ID = "virtual-server";

const VirtualServer = {
  id: REGISTRATION_ID,
  title: "Virtual Server",
  style: {
    width: 640,
    height: 620,
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
    const { realmID, channelID } = virtualServerService.getNetworkRoute();

    // TODO: Implement?
    // const handleStopVirtualServer = useCallback(() => {}, []);

    return (
      <Layout>
        <Header style={{ textAlign: "center" }}>
          <Padding>
            <AppLinkButton
              id={CALL_CENTRAL_STATION_REGISTRATION_ID}
              title="Network"
              style={{ float: "left" }}
            />
            {isHosting && (
              <button
                onClick={() => virtualServerService.stopVirtualServer()}
                style={{ backgroundColor: "red", float: "right" }}
              >
                Stop
              </button>
            )}
            <div>
              {isHosting && (
                <div style={{ fontSize: ".9em" }}>
                  Realm ID: {realmID}
                  <br />
                  Channel ID: {channelID}
                </div>
              )}
            </div>
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
            <HostingView />
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
