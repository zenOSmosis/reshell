import Layout, { Header, Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";
import Full from "@components/Full";
import ObjectViewer from "@components/ObjectViewer";

import Overview from "../../components/Overview";

export default function MainContent({
  spyAgents,
  spyAgentClassNames,
  selectedSpyAgent,
  registeredSpyClassNames,
}) {
  if (!selectedSpyAgent) {
    return (
      <Overview
        spyAgentClassNames={spyAgentClassNames}
        registeredSpyClassNames={registeredSpyClassNames}
      />
    );
  }

  return (
    <Layout>
      <Header>
        <Padding>{selectedSpyAgent.getTitle()}</Padding>
      </Header>
      <Content>
        <Full style={{ overflowY: "auto" }}>
          <ObjectViewer src={selectedSpyAgent.getState()} />
        </Full>
      </Content>
      <Footer>
        <Padding>
          <span className="note">ReShell Native JavaScript API Spy System</span>
        </Padding>
      </Footer>
    </Layout>
  );
}
