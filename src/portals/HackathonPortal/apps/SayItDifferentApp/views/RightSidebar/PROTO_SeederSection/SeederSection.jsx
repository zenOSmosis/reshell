import { useState } from "react";
import Section from "@components/Section";
import Padding from "@components/Padding";

const MAX_PARAGRAPHS = 4;
const MAX_SENTENCES_PER_PARAGRAPH = 4;

const NUMBER_MAP = new Map();
NUMBER_MAP.set(1, "one");
NUMBER_MAP.set(2, "two");
NUMBER_MAP.set(3, "three");
NUMBER_MAP.set(4, "four");

// TODO: Fetch from http://metaphorpsum.com/ (NOTE: This isn't an HTTPS route)
export default function SeederSection({ onGenerateRandomStory }) {
  const [totalParagraphs, setTotalParagraphs] = useState(1);
  const [totalSentencesPerParagraph, setTotalSentencesPerParagraph] =
    useState(2);

  return (
    <Section>
      <h1>Seeder</h1>
      <Padding>
        Create{" "}
        <select
          value={totalParagraphs}
          onChange={evt => setTotalParagraphs(parseInt(evt.target.value, 10))}
        >
          {[
            ...Array(MAX_PARAGRAPHS)
              .fill(1)
              .map((nil, idx) => {
                const value = idx + 1;

                return (
                  <option value={value.toString()}>
                    {NUMBER_MAP.get(value)}
                  </option>
                );
              }),
          ]}
        </select>{" "}
        random paragraph{totalParagraphs !== 1 ? "s" : ""} with{" "}
        <select
          value={totalSentencesPerParagraph}
          onChange={evt =>
            setTotalSentencesPerParagraph(parseInt(evt.target.value, 10))
          }
        >
          {[
            ...Array(MAX_SENTENCES_PER_PARAGRAPH)
              .fill(1)
              .map((nil, idx) => {
                const value = idx + 1;

                return (
                  <option value={value.toString()}>
                    {NUMBER_MAP.get(value)}
                  </option>
                );
              }),
          ]}
        </select>{" "}
        sentence
        {totalSentencesPerParagraph !== 1 ? "s" : ""}.
        <Padding style={{ textAlign: "center" }}>
          <button
            onClick={() =>
              onGenerateRandomStory({
                totalParagraphs,
                totalSentencesPerParagraph,
              })
            }
          >
            Create
          </button>
        </Padding>
      </Padding>
    </Section>
  );
}
