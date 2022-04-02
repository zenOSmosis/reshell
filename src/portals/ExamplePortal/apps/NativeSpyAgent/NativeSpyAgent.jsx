import Layout, { Content, Footer, Row, Column } from "@components/Layout";
import Padding from "@components/Padding";

import NativeSpyService from "@services/NativeSpyService";

export const REGISTRATION_ID = "native-spy-agent";

const NativeSpyAgent = {
  id: "native-spy-agent",
  title: "Native Spy Agent",
  style: {
    width: 640,
    height: 480,
  },
  serviceClasses: [NativeSpyService],
  view: function View({ appServices }) {
    // const nativeSpyService = appServices[NativeSpyService];

    return (
      <Layout>
        <Content>
          <Row>
            <Column style={{ backgroundColor: "gray", maxWidth: 180 }}>
              <Padding>[service]</Padding>
            </Column>
            <Column>
              <Layout>
                <Content>
                  <Padding>[state]</Padding>
                </Content>
                <Footer>
                  <Padding>
                    <span className="note">ReShell DOM Spy System</span>
                  </Padding>
                </Footer>
              </Layout>
            </Column>
          </Row>
        </Content>
      </Layout>
    );
  },
};

export default NativeSpyAgent;
