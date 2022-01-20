import { useEffect, useState } from "react";

import Padding from "@components/Padding";
import Layout, { Header, Content, Footer } from "@components/Layout";
import AppLinkButton from "@components/AppLinkButton";
import LabeledLED from "@components/labeled/LabeledLED";
import Center from "@components/Center";
import Timer from "@components/Timer";

import NetworkCreatorForm from "./views/NetworkCreatorForm";
import HostingView from "./views/HostingView";

import { REGISTRATION_ID as CALL_PLAYER_REGISTRATION_ID } from "../CallPlayerApp";

import SpeakerAppSocketAuthenticationService from "@portals/SpeakerAppPortal/services/SpeakerAppSocketAuthenticationService";
import SpeakerAppVirtualServerService from "@portals/SpeakerAppPortal/services/SpeakerAppVirtualServerService";
import LocalDeviceIdentificationService from "@services/LocalDeviceIdentificationService";

export const REGISTRATION_ID = "virtual-server";

const VirtualServerApp = {
  id: REGISTRATION_ID,
  title: "Virtual Server",
  style: {
    width: 640,
    height: 620,
  },
  serviceClasses: [
    SpeakerAppSocketAuthenticationService,
    SpeakerAppVirtualServerService,
    LocalDeviceIdentificationService,
  ],
  view: function View({ appServices }) {
    const socketService = appServices[SpeakerAppSocketAuthenticationService];
    const virtualServerService = appServices[SpeakerAppVirtualServerService];
    const localDeviceIdentificationService =
      appServices[LocalDeviceIdentificationService];

    const isHosting = virtualServerService.getIsHosting();
    const { realmId, channelId } = virtualServerService.getNetworkRoute();

    const [deviceAddress, setDeviceAddress] = useState(null);

    useEffect(() => {
      localDeviceIdentificationService
        .fetchDeviceAddress()
        .then(setDeviceAddress)
        .catch(console.error);
    }, [localDeviceIdentificationService]);

    if (!deviceAddress) {
      return <Center>Fetching device address...</Center>;
    }

    return (
      <Layout>
        <Header style={{ textAlign: "center" }}>
          <Padding>
            <AppLinkButton
              id={CALL_PLAYER_REGISTRATION_ID}
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
                  Realm ID: {realmId}
                  <br />
                  Channel ID: {channelId}
                </div>
              )}
            </div>
          </Padding>
        </Header>
        <Content>
          {!isHosting ? (
            <NetworkCreatorForm
              deviceAddress={deviceAddress}
              onSubmit={formData =>
                virtualServerService.createVirtualServer({
                  ...formData,
                  ...{
                    // TODO:  Supply internally within virtualServerService
                    buildHash: 123422,
                    userAgent: "test-user-agent",
                  },
                })
              }
              // TODO: Supply cached data
              /*
              initialNetworkName = "",
              initialNetworkDescription = "",
              initialIsPublic = true,
              initialRealmId = "",
              initialChannelId = "",
              initialIsShowingAdvanced = false,
              */
            />
          ) : (
            <HostingView />
          )}
        </Content>
        <Footer>
          <Padding>
            {isHosting && (
              <div style={{ float: "left" }}>
                <Timer onTick={virtualServerService.getVirtualServerUptime} />
              </div>
            )}

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

export default VirtualServerApp;
