import Layout, {
  Header,
  Content,
  Footer,
  Row,
  Column,
} from "@components/Layout";
import Padding from "@components/Padding";
import VirtualLink from "@components/VirtualLink";
import Full from "@components/Full";

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
              style={{
                backgroundColor: "rgba(255,255,255,.1)",
                maxWidth: 180,
              }}
            >
              <Full style={{ overflowY: "auto" }}>
                <Padding>
                  <h1>Class</h1>
                  <div>
                    <ul>
                      {wrappedNativeClassNames.map(wrappedClassName => (
                        <li key={wrappedClassName}>
                          <VirtualLink>{wrappedClassName}</VirtualLink>
                          <ol>
                            <li>one</li>
                            <li>two</li>
                          </ol>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Padding>
              </Full>
            </Column>
            <Column>
              <Layout>
                <Header>
                  <Padding>[header]</Padding>
                </Header>
                <Content>
                  <Full style={{ overflowY: "auto" }}>
                    <Padding>[content]</Padding>
                  </Full>
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
