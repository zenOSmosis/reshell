import Section from "@components/Section";
import Padding from "@components/Padding";
import AutoScaler from "@components/AutoScaler";
import Center from "@components/Center";

import NoData from "../../NoData";

export default function SentimentSection({ sentiment }) {
  return (
    <Section>
      <h1>Sentiment</h1>
      <Padding style={{ height: 100 }}>
        {sentiment.title ? (
          <AutoScaler>
            <Center>
              <div>
                <div style={{ fontSize: "3.5em" }}>{sentiment.emoji}</div>
                <div>{sentiment.title}</div>
              </div>
            </Center>
          </AutoScaler>
        ) : (
          <NoData />
        )}
      </Padding>
    </Section>
  );
}
