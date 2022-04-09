import Center from "@components/Center";
import Padding from "@components/Padding";
import ExternalLink from "@components/ExternalLink";
import ExternalLinkButton from "@components/ExternalLinkButton";

import getContactURL from "@utils/getContactURL";

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
            {name}: <ExternalLink href={url}>{url}</ExternalLink>
          </Padding>
        ))}
      </div>

      <hr />

      <p>
        <ExternalLinkButton href={getContactURL()}>
          Contact Us
        </ExternalLinkButton>
      </p>
    </Center>
  );
}
