import Layout, { Header, Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";
import Full from "@components/Full";
import ObjectViewer from "@components/ObjectViewer";
import { Row, Column } from "@components/Layout";
import Ellipses from "@components/Ellipses";

import Overview from "../../components/Overview";

export default function MainContent({
  spyAgentClassNames,
  selectedSpyAgent,
  onSpyAgentDeselect,
  registeredSpyClassNames,
}) {
  const title = selectedSpyAgent ? selectedSpyAgent.getTitle() : "Overview";

  return (
    <Layout>
      <Header>
        <Padding>
          <Row>
            <Column>
              <h1>
                <Ellipses>{title}</Ellipses>
              </h1>
            </Column>
            <Column disableHorizontalFill>
              <button disabled={!selectedSpyAgent} onClick={onSpyAgentDeselect}>
                Reset
              </button>
            </Column>
          </Row>
        </Padding>
      </Header>
      <Content>
        {selectedSpyAgent ? (
          <Full style={{ overflowY: "auto" }}>
            <ObjectViewer src={selectedSpyAgent.getState()} />
          </Full>
        ) : (
          <Overview
            spyAgentClassNames={spyAgentClassNames}
            registeredSpyClassNames={registeredSpyClassNames}
          />
        )}
      </Content>
      <Footer>
        <Padding>
          <span className="note">ReShell Native JavaScript API Spy System</span>
        </Padding>
      </Footer>
    </Layout>
  );
}
