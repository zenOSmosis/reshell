import Layout, { Header, Content, Footer } from "@components/Layout";
import Center from "@components/Center";

export const REGISTRATION_ID = "local-user-profile";

const LocalUserProfile = {
  id: REGISTRATION_ID,
  title: "User Profile",
  style: {
    width: 640,
    height: 480,
  },
  view: function View() {
    return (
      <Layout>
        <Header>[options]</Header>
        <Content>
          <Center canOverflow={true}>[local user profile]</Center>
        </Content>
        <Footer>[settings / etc]</Footer>
      </Layout>
    );
  },
};

export default LocalUserProfile;
