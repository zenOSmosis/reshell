import ReShellCore from "@core";
import PhantomCore from "phantom-core";

import Layout, {
  Header,
  Content,
  Footer,
  Row,
  Column,
} from "@components/Layout";
import Center from "@components/Center";
import Padding from "@components/Padding";
import AppLinkButton from "@components/AppLinkButton";
import ObjectViewer from "@components/ObjectViewer";

import { REGISTRATION_ID as ENVIRONMENT_REGISTRATION_ID } from "@portals/ExamplePortal/apps/EnvironmentApp";
import { REGISTRATION_ID as CHECK_FOR_UPDATES_REGISTRATION_ID } from "@portals/ExamplePortal/apps/CheckForUpdatesApp";

const packageJson = require("@root/package.json");

export const REGISTRATION_ID = "software-info";

const SoftwareInfoApp = {
  id: REGISTRATION_ID,
  title: "Software Info",
  style: {
    width: 640,
    height: 480,
  },
  view: function View() {
    return (
      <Layout>
        <Header>
          <Padding>Package.json content</Padding>
        </Header>
        <Content>
          <ObjectViewer src={packageJson} />
        </Content>
        <Footer>
          <Padding>
            <Row>
              <Column>
                <Center>
                  <div
                    style={{ float: "left", textAlign: "left" }}
                    className="note"
                  >
                    ReShell version: {ReShellCore.getReShellVersion()}
                    <br />
                    PhantomCore version: {PhantomCore.getPhantomCoreVersion()}
                    <br />
                    Portal: {ReShellCore.getPortalName()}
                  </div>
                </Center>
              </Column>
              <Column>
                <Center style={{ textAlign: "right" }}>
                  <AppLinkButton id={CHECK_FOR_UPDATES_REGISTRATION_ID} />{" "}
                  <AppLinkButton id={ENVIRONMENT_REGISTRATION_ID} />
                </Center>
              </Column>
            </Row>
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default SoftwareInfoApp;
