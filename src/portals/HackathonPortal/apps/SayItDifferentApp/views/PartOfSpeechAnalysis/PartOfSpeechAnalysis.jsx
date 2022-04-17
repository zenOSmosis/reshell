import { useEffect, useState } from "react";
import Layout, { Header, Content } from "@components/Layout";
import ButtonPanel from "@components/ButtonPanel";
import Padding from "@components/Padding";
import Section from "@components/Section";
import ObjectViewer from "@components/ObjectViewer";
import Full from "@components/Full";

import PartOfSpeechTable from "./components/PartOfSpeechTable";

const VIEW_MODE_TABLE = "table";
const VIEW_MODE_OBJECT = "object";

export default function PartOfSpeechAnalysis({ posAnalyzer, text }) {
  const [viewType, setViewType] = useState(VIEW_MODE_TABLE);

  const [partsOfSpeech, setPartsOfSpeech] = useState([]);

  // Fetch part of speech analysis as text changes
  useEffect(() => {
    if (text) {
      posAnalyzer.fetchPartsOfSpeech(text).then(partsOfSpeech => {
        setPartsOfSpeech(partsOfSpeech);
      });
    } else {
      setPartsOfSpeech([]);
    }
  }, [text, posAnalyzer]);

  return (
    <Layout>
      <Header>
        <Padding style={{ textAlign: "center" }}>
          <span className="note">View mode:</span>{" "}
          <ButtonPanel
            buttons={[
              {
                content: "Table",
                onClick: () => setViewType(VIEW_MODE_TABLE),
              },
              {
                content: "Object",
                onClick: () => setViewType(VIEW_MODE_OBJECT),
              },
            ]}
          />
        </Padding>
      </Header>
      <Content>
        {viewType === "object" ? (
          <ObjectViewer src={partsOfSpeech} />
        ) : (
          <Full style={{ overflowY: "auto" }}>
            <PartOfSpeechTable partsOfSpeech={partsOfSpeech} />
          </Full>
        )}
      </Content>
    </Layout>
  );
}
