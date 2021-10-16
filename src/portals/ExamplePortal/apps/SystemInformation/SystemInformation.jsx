// import { useCallback } from "react";

// import Full from "@components/Full";
import Padding from "@components/Padding";
import Layout, { Content, Footer, Row, Column } from "@components/Layout";
import Center from "@components/Center";
import ButtonPanel from "@components/ButtonPanel";
// import AutoScaler from "@components/AutoScaler";

import getCopyright from "@utils/getCopyright";

const AboutReShell = {
  id: "system-information",
  title: "System Information",
  style: {
    width: 640,
    height: 480,
  },
  isPinned: true,
  titleBarView: function TitleBarView({ sharedState, setSharedState }) {
    /*
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
    */

    return (
      <Padding className="button-group">
        <ButtonPanel
          buttons={[
            {
              content: "Overview",
              onClick: () => null,
            },
            {
              content: "Storage",
              onClick: () => null,
            },
            {
              content: "Memory",
              onClick: () => null,
            },
            {
              content: "Services",
              onClick: () => null,
            },
          ]}
        />
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
                <div>Desktop Environment</div>
                <div>ReShell</div>
                <div>Version xx</div>

                <div style={{ marginTop: 20 }}>
                  Computer info... [Host Bridge]
                </div>

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
          <Padding style={{ textAlign: "center", opacity: 0.5 }}>
            {getCopyright()}
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default AboutReShell;
