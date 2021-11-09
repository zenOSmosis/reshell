// import { useCallback } from "react";
import Layout, { Header, Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";
import Center from "@components/Center";
import AppLinkButton from "@components/AppLinkButton";
import LabeledLED from "@components/labeled/LabeledLED";
import NoWrap from "@components/NoWrap";

import Networks from "./views/Networks";
import NoNetworks from "./views/NoNetworks";

import { REGISTRATION_ID as LOCAL_USER_PROFILE_REGISTRATION_ID } from "../LocalUserProfile";
import { REGISTRATION_ID as INPUT_MEDIA_DEVICES_REGISTRATION_ID } from "@portals/ExamplePortal/apps/InputMediaDevices";
import { REGISTRATION_ID as VIRTUAL_SERVER_REGISTRATION_ID } from "../VirtualServer";
import { REGISTRATION_ID as SCREEN_CAPTURE_REGISTRATION_ID } from "@portals/ExamplePortal/apps/ScreenCapture";

// import useAppRegistrationLink from "@hooks/useAppRegistrationLink";

import SpeakerAppSocketAuthenticationService from "@portals/SpeakerAppPortal/services/SpeakerAppSocketAuthenticationService";
import SpeakerAppNetworkService from "@portals/SpeakerAppPortal/services/SpeakerAppNetworkService";

export const REGISTRATION_ID = "network";

// TODO: Listen for GET requests and automatically connect to network if
// request is similar to:
// network/0x678308810e1087A3aED280d0feB957C9fcEd1C8B/48k-lounge

const CallCentralStation = {
  id: REGISTRATION_ID,
  title: "Call Central Station",
  style: {
    width: 640,
    height: 480,
  },
  isAutoStart: true,
  isPinned: true,
  isPinnedToDock: true,
  serviceClasses: [
    SpeakerAppSocketAuthenticationService,
    SpeakerAppNetworkService,
  ],
  view: function View({ appServices }) {
    const socketService = appServices[SpeakerAppSocketAuthenticationService];
    const networkService = appServices[SpeakerAppNetworkService];

    const networks = networkService.getNetworks();
    const lenNetworks = networks.length;

    /*
    const { link: virtualServerLink } = useAppRegistrationLink(
      VIRTUAL_SERVER_REGISTRATION_ID
    );

    const handleCreateNetwork = useCallback(virtualServerLink, [
      virtualServerLink,
    ]);

    const handleOpenPrivateNetwork = useCallback(() => {
      alert("TODO: Implement handleOpenPrivateNetwork");
    }, []);
    */

    return (
      <Layout>
        <Header>
          <Padding>
            <NoWrap className="button-group">
              <AppLinkButton id={LOCAL_USER_PROFILE_REGISTRATION_ID} />
              <AppLinkButton
                id={VIRTUAL_SERVER_REGISTRATION_ID}
                title="Create Network"
              />
            </NoWrap>
            {
              // [networks]  [private network]
            }
            <NoWrap style={{ float: "right" }} className="button-group">
              <button>Private Network</button>
              {/*
                <button>Search</button>
                */}
            </NoWrap>
          </Padding>
        </Header>
        <Content>
          <Padding>
            <Center canOverflow={true}>
              {lenNetworks === 0 ? (
                <NoNetworks />
              ) : (
                <Networks
                  networks={networks}
                  // isConnected,
                  // realmID,
                  // channelID,
                  onConnectToNetwork={networkService.connectToNetwork}
                  onDisconnectFromNetwork={networkService.disconnectFromNetwork}
                />
              )}
            </Center>
          </Padding>
        </Content>
        <Footer>
          <Padding>
            <span className="button-group">
              <AppLinkButton
                id={INPUT_MEDIA_DEVICES_REGISTRATION_ID}
                title="Configure Audio"
              />
              <AppLinkButton id={SCREEN_CAPTURE_REGISTRATION_ID} />
              <LabeledLED
                label="Socket"
                color={socketService.getIsConnected() ? "green" : "gray"}
                style={{ float: "right" }}
              />
            </span>
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default CallCentralStation;
