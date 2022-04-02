import Layout, { Content, Footer, Row, Column } from "@components/Layout";
import Padding from "@components/Padding";

import NativeSpyService from "@services/NativeSpyService";

export const REGISTRATION_ID = "native-spy-agent";

const NativeSpyAgentApp = {
  id: "native-spy-agent",
  title: "Native Spy Agent",
  style: {
    width: 640,
    height: 480,
  },
  serviceClasses: [NativeSpyService],
  view: function View({ appServices }) {
    const nativeSpyService = appServices[NativeSpyService];

    const wrappedNativeClassNames = nativeSpyService.getRegisteredSpyAgents();

    // TODO: Remove
    console.log({
      state: nativeSpyService.getState(),
      // registeredSpyAgents: nativeSpyService.getRegisteredSpyAgents(),
    });

    return (
      <Layout>
        <Content>
          <Row>
            <Column
              style={{ backgroundColor: "gray", maxWidth: 180, color: "#000" }}
            >
              <Padding>
                <h1>Class</h1>
                {wrappedNativeClassNames.map(className => (
                  <ul key={className}>{className} (?)</ul>
                ))}
              </Padding>
            </Column>
            <Column>
              <Layout>
                <Content>
                  <Padding>[state]</Padding>
                </Content>
                <Footer>
                  <Padding>
                    <span className="note">
                      ReShell Native JavaScript API Spy System
                    </span>
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

export default NativeSpyAgentApp;
