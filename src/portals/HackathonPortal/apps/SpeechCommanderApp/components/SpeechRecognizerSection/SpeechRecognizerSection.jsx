import Section from "@components/Section";
import Padding from "@components/Padding";
import LabeledToggle from "@components/labeled/LabeledToggle";
import { Row, Column } from "@components/Layout";

import SpeechActivityTable from "../SpeechActivityTable";

// TODO: Add prop-types
// TODO: Document
export default function SpeechRecognizerSection({ speechProvider }) {
  return (
    <Section>
      <h2>{speechProvider.title}</h2>

      <Padding>
        <Row>
          <Column>
            <LabeledToggle
              masterLabel="Speech Recognition"
              disabled={speechProvider.disabled}
            />
          </Column>
          <Column>
            <LabeledToggle
              masterLabel="Control Desktop"
              disabled={!speechProvider.active || speechProvider.disabled}
            />
          </Column>
        </Row>
      </Padding>
      {!speechProvider.disabled && (
        <Padding>
          <SpeechActivityTable />
        </Padding>
      )}
    </Section>
  );
}
