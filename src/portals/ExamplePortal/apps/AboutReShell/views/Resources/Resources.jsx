import Center from "@components/Center";
import Padding from "@components/Padding";

const LINKS = {
  zenOSmosis: "https://zenOSmosis.com",
  GitHub: "https://github.com/zenosmosis",
  "Speaker.app": "https://speaker.app",
};

export default function Resources() {
  return (
    <Center canOverflow={true}>
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

      <hr />

      <p>
        To contact us directly, email:{" "}
        <a href="mailto:info@zenosmosis.com">info@zenosmosis.com</a>.
      </p>
    </Center>
  );
}
