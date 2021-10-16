import Full from "@components/Full";
import Padding from "@components/Padding";
import { Row, Column } from "@components/Layout";

export default function Detail() {
  return (
    <Full style={{ overflowY: "auto" }}>
      <p>
        ReShell is a browser-based layout framework and UI services engine
        composed of various{" "}
        <a
          href="https://github.com/zenosmosis"
          target="_blank"
          rel="noreferrer"
        >
          open-source components
        </a>
        .
      </p>
      <p>
        It is currently in an alpha phase, and other builds may have other
        built-in applications.
      </p>
      <p>
        Leveraged off of the core code for{" "}
        <a href="https://speaker.app" target="_blank" rel="noreferrer">
          Speaker.app
        </a>{" "}
        and other{" "}
        <a href="https://zenosmosis.com" target="_blank" rel="noreferrer">
          zenOSmosis
        </a>{" "}
        projects based on{" "}
        <a
          href="https://github.com/zenOSmosis/phantom-core"
          target="_blank"
          rel="noreferrer"
        >
          PhantomCore
        </a>
        , a library for managing the JavaScript application lifecycle.
      </p>

      <Padding>
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
      </Padding>
    </Full>
  );
}
