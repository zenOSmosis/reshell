import { useState } from "react";
import Layout, { Header, Content } from "@components/Layout";
import ButtonPanel from "@components/ButtonPanel";
import Padding from "@components/Padding";
import Section from "@components/Section";
import ObjectViewer from "@components/ObjectViewer";
import Full from "@components/Full";

import PartOfSpeechTable from "./components/PartOfSpeechTable";

const VIEW_MODE_OBJECT = "object";
const VIEW_MODE_TABLE = "table";

export default function PartOfSpeechAnalysis({ text, partsOfSpeech }) {
  const [viewType, setViewType] = useState(VIEW_MODE_OBJECT);

  return (
    <Layout>
      <Header>
        <Padding style={{ textAlign: "center" }}>
          <span className="note">View mode:</span>{" "}
          <ButtonPanel
            buttons={[
              {
                content: "Object",
                onClick: () => setViewType(VIEW_MODE_OBJECT),
              },
              {
                content: "Table",
                onClick: () => setViewType(VIEW_MODE_TABLE),
              },
            ]}
          />
        </Padding>
      </Header>
      <Content>
        <Section style={{ width: "100%", height: "100%" }}>
          {viewType === "object" ? (
            <ObjectViewer src={partsOfSpeech} />
          ) : (
            <Full style={{ overflowY: "auto" }}>
              <PartOfSpeechTable partsOfSpeech={partsOfSpeech} />
            </Full>
          )}
        </Section>
      </Content>
    </Layout>
  );
}
