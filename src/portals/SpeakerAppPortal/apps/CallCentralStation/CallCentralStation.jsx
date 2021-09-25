import Layout, { Header, Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import AppLinkButton from "@components/AppLinkButton";
import LabeledLED from "@components/labeled/LabeledLED";

import { REGISTRATION_ID as LOCAL_USER_PROFILE_REGISTRATION_ID } from "../LocalUserProfile";
import { REGISTRATION_ID as INPUT_MEDIA_DEVICES_REGISTRATION_ID } from "@portals/ExamplePortal/apps/InputMediaDevices";

import SpeakerAppSocketAuthenticationService from "@portals/SpeakerAppPortal/services/SpeakerAppSocketAuthenticationService";
import SpeakerAppNetworkService from "@portals/SpeakerAppPortal/services/SpeakerAppNetworkService";

const CallCentralStation = {
  id: "call-central-station",
  title: "Call Central Station",
  style: {
    width: 640,
    height: 480,
  },
  isAutoStart: true,
  serviceClasses: [
    SpeakerAppSocketAuthenticationService,
    SpeakerAppNetworkService,
  ],
  view: function View({ appServices }) {
    const socketService = appServices[SpeakerAppSocketAuthenticationService];
    const networkService = appServices[SpeakerAppNetworkService];

    return (
      <Layout>
        <Header>
          <AppLinkButton id={LOCAL_USER_PROFILE_REGISTRATION_ID} />
          [networks] [create network] [private network]
        </Header>
        <Content>
          <Center canOverflow={true}>
            [public networks]
            <button
              // TODO: Refactor
              onClick={() =>
                networkService
                  .fetchNetworks()
                  .then(networks => console.log({ networks }))
              }
            >
              Fetch Networks
            </button>
          </Center>
        </Content>
        <Footer>
          <AppLinkButton
            id={INPUT_MEDIA_DEVICES_REGISTRATION_ID}
            title="Configure Audio"
          />
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

export default CallCentralStation;
