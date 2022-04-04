import Layout, { Header, Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";
import Full from "@components/Full";
import ObjectViewer from "@components/ObjectViewer";

export default function MainContent({ spyAgents, selectedSpyAgent }) {
  if (!selectedSpyAgent) {
    return <div>Select a spy agent</div>;
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
