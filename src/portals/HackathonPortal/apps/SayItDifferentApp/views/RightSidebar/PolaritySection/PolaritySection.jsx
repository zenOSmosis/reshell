import { useMemo } from "react";

import Section from "@components/Section";
import Padding from "@components/Padding";
import AutoScaler from "@components/AutoScaler";
import Center from "@components/Center";

// TODO: Refactor
const SENTIMENTS = [
  {
    emoji: "🥳",
    title: "Very Positive",
  },
  {
    emoji: "😀",
    title: "Really Positive",
  },
  {
    emoji: "😄",
    title: "Positive",
  },
  {
    emoji: "🙂",
    title: "Somewhat Positive",
  },
  {
    emoji: "😐",
    title: "Neutral",
  },
  {
    emoji: "🙁",
    title: "Somewhat Negative",
  },
  {
    emoji: "😣",
    title: "Negative",
  },
  {
    emoji: "😠",
    title: "Really Negative",
  },
  {
    emoji: "😡",
    title: "Very Negative",
  },
].reverse();

export default function PolaritySection({ polarity }) {
  const sentiment = useMemo(() => {
    const polePercent = (polarity.polarity + 10) * 5;

    const lenSentiments = SENTIMENTS.length;

    let idx = Math.floor(lenSentiments * (polePercent / 100));

    // Keep idx within constraints
    if (idx < 0) {
      idx = 0;
    }
    if (idx >= lenSentiments) {
      idx = lenSentiments - 1;
    }

    return SENTIMENTS[idx];
  }, [polarity]);

  return (
    <Section>
      <h1>Sentiment</h1>
      <Padding style={{ height: 100 }}>
        {sentiment && (
          <AutoScaler>
            <Center>
              <div>
                <div style={{ fontSize: "3.5em" }}>{sentiment.emoji}</div>
                <div>{sentiment.title}</div>
              </div>
            </Center>
          </AutoScaler>
        )}
      </Padding>
    </Section>
  );
}
