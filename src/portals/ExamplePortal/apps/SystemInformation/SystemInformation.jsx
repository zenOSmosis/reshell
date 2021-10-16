import { useCallback } from "react";

import Full from "@components/Full";
import Padding from "@components/Padding";
import Layout, { Content, Footer, Row, Column } from "@components/Layout";
import Center from "@components/Center";
import AutoScaler from "@components/AutoScaler";

const AboutReShell = {
  id: "system-information",
  title: "System Information",
  style: {
    width: 640,
    height: 480,
    backgroundColor: "rgba(42,42,42,.5)",
  },
  titleBarView: function TitleBarView({ sharedState, setSharedState }) {
    const handleSetSearchQuery = useCallback(
      evt => setSharedState({ searchQuery: evt.target.value }),
      [setSharedState]
    );

    const handleDoubleClick = useCallback(
      evt => {
        // Prevent double-clicks from resizing the window if there is text in
        // the search bar
        if (Boolean(sharedState.searchQuery)) {
          evt.stopPropagation();
        }
      },
      [sharedState]
    );

    return (
      <Padding className="button-group">
        <button>Overview</button>
        <button>Storage</button>
        <button>Memory</button>
        <button>Services</button>
      </Padding>
    );
  },
  view: function View() {
    return (
      <Layout>
        <Content>
          <Center canOverflow={true}>
            <Row>
              <Column>...</Column>
              <Column style={{ textAlign: "left" }}>
                <div>ReShell</div>
                <div>Version xx</div>

                <div style={{ marginTop: 20 }}>Computer info...</div>

                <div style={{ marginTop: 20 }}>
                  <button>GitHub...</button>
                  <button>Web...</button>
                  <button>Speaker.app...</button>
                </div>
              </Column>
            </Row>
          </Center>
        </Content>
        <Footer>
          <Padding
            style={{ textAlign: "center", opacity: 0.5 }}
            className="note"
          >
            Copyright &copy; 2010 - {new Date().getFullYear()} zenOSmosis. All
            rights reserved.
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default AboutReShell;
