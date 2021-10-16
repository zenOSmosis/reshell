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
      {
        // TODO: Display grid here for: PhantomCore, etc.
      }

      <p style={{ fontWeight: "bold" }}>Additional resources:</p>
      <div style={{ display: "inline-block", textAlign: "left" }}>
        {Object.entries(LINKS).map(([name, url], idx) => (
          <Padding key={idx}>
            {name}:{" "}
            <a href={url} target="_blank" rel="noreferrer">
              {url}
            </a>
          </Padding>
        ))}
      </div>
    </Center>
  );
}
