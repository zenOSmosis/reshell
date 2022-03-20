import Section from "@components/Section";
import Padding from "@components/Padding";
import LabeledToggle from "@components/labeled/LabeledToggle";
import LabeledLED from "@components/labeled/LabeledLED";
import { Row, Column } from "@components/Layout";
import Timer from "@components/Timer";

import SpeechActivityTable from "../SpeechActivityTable";

// TODO: Add prop-types
// TODO: Document
export default function SpeechRecognizerSection({ speechProvider }) {
  return (
    <Section>
      {!speechProvider.disabled && (
        <div style={{ position: "absolute", top: 4, left: 8 }}>
          {
            // TODO: Add onTick handler
          }
          <Timer
            onTick={() => null}
            style={{
              color:
                !speechProvider.active || speechProvider.disabled
                  ? "gray"
                  : "inherit",
            }}
          />
        </div>
      )}
      {!speechProvider.disabled ||
        (speechProvider.status && (
          <div style={{ float: "right", overflow: "auto" }}>
            <div style={{ display: "inline-block", marginLeft: 10 }}>
              {!speechProvider.disabled ? (
                <LabeledLED
                  label="Voice Activity"
                  disabled={!speechProvider.active || speechProvider.disabled}
                />
              ) : (
                <span className="note">{speechProvider.status}</span>
              )}
            </div>
          </div>
        ))}

      <h2 style={{ color: speechProvider.disabled ? "gray" : null }}>
        {speechProvider.title}
      </h2>
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
        <div style={{ overflow: "auto" }}>
          <Padding>
            <SpeechActivityTable disabled={!speechProvider.active} />
          </Padding>

          <Padding style={{ textAlign: "right" }}>
            {speechProvider.requiresAPIKey && (
              <>
                <button>Set API Key</button>{" "}
                <button style={{ backgroundColor: "red" }}>
                  Delete API Key
                </button>
              </>
            )}
          </Padding>
        </div>
      )}
      {speechProvider.serviceProviderURL && (
        <div className="note">
          Provider information:{" "}
          <a
            href={speechProvider.serviceProviderURL}
            target="_blank"
            rel="noreferrer"
          >
            {speechProvider.serviceProviderURL}
          </a>
        </div>
      )}
    </Section>
  );
}
