import { useEffect } from "react";
import Layout, { Header, Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import AppLinkButton from "@components/AppLinkButton";

import { REGISTRATION_ID as LOCAL_USER_PROFILE_REGISTRATION_ID } from "../LocalUserProfile";
import { REGISTRATION_ID as INPUT_MEDIA_DEVICES_REGISTRATION_ID } from "@portals/ExamplePortal/apps/InputMediaDevices";

import SpeakerAppSocketAuthenticationService from "@portals/SpeakerAppPortal/services/SpeakerAppSocketAuthenticationService";

const CallCentralStation = {
  id: "call-central-station",
  title: "Call Central Station",
  style: {
    width: 640,
    height: 480,
  },
  isAutoStart: true,
  serviceClasses: [SpeakerAppSocketAuthenticationService],
  view: function View({ windowServices }) {
    const socketService = windowServices[SpeakerAppSocketAuthenticationService];

    useEffect(() => {
      socketService.connect();
    }, [socketService]);

    return (
      <Layout>
        <Header>
          <AppLinkButton id={LOCAL_USER_PROFILE_REGISTRATION_ID} />
          [networks] [create network] [private network]
        </Header>
        <Content>
          <Center canOverflow={true}>[public networks]</Center>
        </Content>
        <Footer>
          <AppLinkButton
            id={INPUT_MEDIA_DEVICES_REGISTRATION_ID}
            title="Configure Audio"
          />
        </Footer>
      </Layout>
    );
  },
};

export default CallCentralStation;
