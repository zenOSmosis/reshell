import Full from "@components/Full";
import Padding from "@components/Padding";
import ExternalLink from "@components/ExternalLink";
import ExternalLinkButton from "@components/ExternalLinkButton";

const LINKS = {
  PhantomCore: "https://github.com/zenOSmosis/phantom-core",
  PhantomCollection:
    "https://github.com/zenOSmosis/phantom-core/tree/main/src/PhantomCollection",

  ReShellCore: "https://github.com/zenOSmosis/reshell.org-static",

  SyncObject: "https://github.com/zenOSmosis/sync-object",
  MediaStreamController:
    "https://github.com/zenOSmosis/media-stream-track-controller",
  WebRTCPeer: "https://github.com/zenOSmosis/webrtc-peer",
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
        ReShell is a browser-based layout library and UI services engine
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
        It is currently in an alpha phase, and{" "}
        <span style={{ fontWeight: "bold" }}>
          other builds (i.e. "portals") may have other built-in applications
        </span>
        .
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
        {Object.entries(LINKS).map(([title, urlOrAction], idx) => {
          return (
            <Padding key={idx} style={{ width: 200, display: "inline-block" }}>
              {typeof urlOrAction === "string" ? (
                <ExternalLinkButton
                  href={urlOrAction}
                  style={LINK_BUTTON_STYLE}
                >
                  {title}
                </ExternalLinkButton>
              ) : (
                <button onClick={urlOrAction} style={LINK_BUTTON_STYLE}>
                  {title}
                </button>
              )}
            </Padding>
          );
        })}
      </div>
    </Full>
  );
}
