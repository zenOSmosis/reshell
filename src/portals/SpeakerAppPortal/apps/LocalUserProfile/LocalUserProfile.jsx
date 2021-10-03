import Layout, { Header, Content } from "@components/Layout";
import Padding from "@components/Padding";
import AppLinkButton from "@components/AppLinkButton";
import LocalUserProfileForm from "./views/LocalUserProfileForm/LocalUserProfileForm";

import SpeakerAppLocalUserProfileService from "@portals/SpeakerAppPortal/services/SpeakerAppLocalUserProfileService";

import { REGISTRATION_ID as CALL_CENTRAL_STATION_REGISTRATION_ID } from "../CallCentralStation";

export const REGISTRATION_ID = "local-user-profile";

const LocalUserProfile = {
  id: REGISTRATION_ID,
  title: "User Profile",
  style: {
    width: 640,
    height: 480,
  },
  serviceClasses: [SpeakerAppLocalUserProfileService],
  view: function View() {
    return (
      <Layout>
        <Header>
          <Padding>
            <AppLinkButton
              id={CALL_CENTRAL_STATION_REGISTRATION_ID}
              title="Network"
            />
          </Padding>
        </Header>
        <Content>
          <LocalUserProfileForm />
        </Content>
      </Layout>
    );
  },
};

export default LocalUserProfile;
