import Layout, { Header, Content } from "@components/Layout";
import LocalUserProfileForm from "./views/LocalUserProfileForm/LocalUserProfileForm";

import SpeakerAppLocalUserProfileService from "@portals/SpeakerAppPortal/services/SpeakerAppLocalUserProfileService";

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
        <Header>[options]</Header>
        <Content>
          <LocalUserProfileForm />
        </Content>
      </Layout>
    );
  },
};

export default LocalUserProfile;
