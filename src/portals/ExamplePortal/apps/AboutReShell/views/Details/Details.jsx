import Full from "@components/Full";
import Padding from "@components/Padding";
import ExternalLink from "@components/ExternalLink";
import ExternalLinkButton from "@components/ExternalLinkButton";
import VirtualLinkButton from "@components/VirtualLinkButton";

const LINKS = {
  "Phantom Core": "https://github.com/zenOSmosis/phantom-core",
  "Phantom Collection":
    "https://github.com/zenOSmosis/phantom-core/tree/main/src/PhantomCollection",

  "ReShell Core": () => alert("Pending open-source"),

  "Sync Object": "https://github.com/zenOSmosis/sync-object",
  "MediaStream Controller":
    "https://github.com/zenOSmosis/media-stream-track-controller",
  "webrtc-peer": "https://github.com/zenOSmosis/webrtc-peer",
};

// TODO: Refactor
const LINK_BUTTON_STYLE = {
  minHeight: "4em",
  whiteSpace: "wrap",
  width: "100%",
  height: "100%",
};

export default function Details() {
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
        <ExternalLink href="https://speaker.app">Speaker.app</ExternalLink> and
        other{" "}
        <ExternalLink href="https://zenosmosis.com">zenOSmosis</ExternalLink>{" "}
        projects based on{" "}
        <ExternalLink href="https://github.com/zenOSmosis/phantom-core">
          PhantomCore
        </ExternalLink>
        , a library for managing the JavaScript application lifecycle.
      </p>

      <p style={{ fontWeight: "bold" }}>Some included technologies:</p>

      <div style={{ textAlign: "center" }}>
        <div
          style={{ display: "inline-grid", gridTemplateColumns: "1fr 1fr 1fr" }}
        >
          {Object.entries(LINKS).map(([title, urlOrAction], idx) => {
            return (
              <Padding key={idx}>
                {typeof urlOrAction === "string" ? (
                  <ExternalLinkButton
                    href={urlOrAction}
                    style={LINK_BUTTON_STYLE}
                  >
                    {title}
                  </ExternalLinkButton>
                ) : (
                  <VirtualLinkButton
                    onClick={urlOrAction}
                    style={LINK_BUTTON_STYLE}
                  >
                    {title}
                  </VirtualLinkButton>
                )}
              </Padding>
            );
          })}
        </div>
      </div>
    </Full>
  );
}
