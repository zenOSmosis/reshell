import Center from "@components/Center";
import Padding from "@components/Padding";
import { Row, Column } from "@components/Layout";

const LINKS = {
  zenOSmosis: "https://zenOSmosis.com",
  GitHub: "https://github.com/zenosmosis",
  "Speaker.app": "https://speaker.app",
};

export default function Resources() {
  return (
    <Center canOverflow={true}>
      {
        // TODO: Display grid here for: PhantomCore, etc.
      }
      <p style={{ fontWeight: "bold" }}>Some included technologies:</p>
      <Row style={{ height: 50 }}>
        <Column>
          <button>PhantomCore</button>
        </Column>
        <Column>
          <button>PhantomCollection</button>
        </Column>
        <Column>
          <button>ReShell Core</button>
        </Column>
      </Row>
      <Row style={{ height: 50 }}>
        <Column>
          <button>SyncObject</button>
        </Column>
        <Column>
          <button>MediaStream Controller</button>
        </Column>
        <Column>
          <button>webrtc-peer</button>
        </Column>
      </Row>

      <p style={{ fontWeight: "bold" }}>Additional resources:</p>
      <div style={{ display: "inline-block", textAlign: "left" }}>
        {Object.entries(LINKS).map(([name, url], idx) => (
          <Padding key={idx}>
            {name}:{" "}
            {
              // TODO: Use ExternalLink component for this
            }
            <a href={url} target="_blank" rel="noreferrer">
              {url}
            </a>
          </Padding>
        ))}
      </div>
    </Center>
  );
}
