import Layout, { Content, Footer, Row, Column } from "@components/Layout";
import Padding from "@components/Padding";

export default function SpeechActivityTable({
  realTimeTranscription,
  finalizedTranscription,
  disabled = false,
}) {
  return (
    <Row disableVerticalFill style={{ height: 80 }}>
      <Column
        style={{
          border: "1px #999 solid",
          borderRadius: 4,
          backgroundColor: "rgba(0,0,0,.4)",
        }}
      >
        <Padding>
          <Layout>
            <Content>
              <div style={{ color: disabled ? "gray" : "inherit" }}>
                {!disabled && realTimeTranscription
                  ? realTimeTranscription
                  : "N/A"}
              </div>
            </Content>
            <Footer>
              <div
                style={{
                  fontStyle: "italic",
                  fontSize: ".9em",
                  color: "gray",
                }}
              >
                Real-time
              </div>
            </Footer>
          </Layout>
        </Padding>
      </Column>
      <Column
        style={{
          border: "1px #999 solid",
          borderRadius: 4,
          backgroundColor: "rgba(0,0,0,.4)",
        }}
      >
        <Padding>
          <Layout>
            <Content>
              <div style={{ color: disabled ? "gray" : "inherit" }}>
                {!disabled && finalizedTranscription
                  ? finalizedTranscription
                  : "N/A"}
              </div>
            </Content>
            <Footer>
              <div
                style={{
                  fontStyle: "italic",
                  fontSize: ".9em",
                  color: "gray",
                }}
              >
                Finalized
              </div>
            </Footer>
          </Layout>
        </Padding>
      </Column>
    </Row>
  );
}
