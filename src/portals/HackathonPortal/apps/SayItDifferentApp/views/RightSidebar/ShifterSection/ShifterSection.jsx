import Section from "@components/Section";
import Padding from "@components/Padding";

export default function ShifterSection() {
  return (
    <Section>
      <h1>Shifter</h1>
      <p className="note">
        Shifter analyzes the sentence structure of your text and generates new
        sentences based on the same structure.
      </p>
      <Padding style={{ textAlign: "center" }}>
        <button>Shift It</button>
      </Padding>
    </Section>
  );
}
