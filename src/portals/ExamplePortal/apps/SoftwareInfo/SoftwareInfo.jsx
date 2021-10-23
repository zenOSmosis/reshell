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

import { REGISTRATION_ID as ENVIRONMENT_REGISTRATION_ID } from "@portals/ExamplePortal/apps/Environment";

const packageJson = require("@root/package.json");

export const REGISTRATION_ID = "software-info";

const SoftwareInfo = {
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
                    ReShell version: {packageJson.version}
                    <br />
                    Phantom Core version: {PhantomCore.getPhantomCoreVersion()}
                    <br />
                    Portal: {ReShellCore.getPortalName()}
                  </div>
                </Center>
              </Column>
              <Column>
                <Center>
                  <AppLinkButton
                    id={ENVIRONMENT_REGISTRATION_ID}
                    style={{ float: "right" }}
                  />
                </Center>
              </Column>
            </Row>
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default SoftwareInfo;
