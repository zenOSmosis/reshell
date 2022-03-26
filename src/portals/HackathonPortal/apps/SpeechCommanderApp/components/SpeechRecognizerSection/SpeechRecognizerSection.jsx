import Section from "@components/Section";
import Padding from "@components/Padding";
import LabeledToggle from "@components/labeled/LabeledToggle";
import LabeledLED from "@components/labeled/LabeledLED";
import { Row, Column } from "@components/Layout";
import Timer from "@components/Timer";
import ExternalLink from "@components/ExternalLink";

import SpeechActivityTable from "../SpeechActivityTable";

// TODO: Add prop-types
// TODO: Document
export default function SpeechRecognizerSection({ speechProvider }) {
  const speechRecognizerService = speechProvider.speechRecognizerService;
  const apiKeyManagementService = speechProvider.apiKeyManagementService;

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
      {(!speechProvider.disabled || speechProvider.status) && (
        <div style={{ float: "right", overflow: "auto" }}>
          <div style={{ display: "inline-block", marginLeft: 10 }}>
            {!speechProvider.disabled ? (
              <LabeledLED
                label="Voice Activity"
                color={
                  !speechRecognizerService?.getHasRecognizer()
                    ? "gray"
                    : speechRecognizerService?.getIsRecognizing()
                    ? "green"
                    : "red"
                }
                disabled={
                  !speechRecognizerService?.getHasRecognizer() ||
                  speechProvider.disabled
                }
              />
            ) : (
              <span className="note">{speechProvider.status}</span>
            )}
          </div>
        </div>
      )}

      <h2 style={{ color: speechProvider.disabled ? "gray" : null }}>
        {speechProvider.title}
      </h2>
      <Padding>
        <Row>
          <Column>
            <LabeledToggle
              masterLabel="Speech Recognition"
              disabled={speechProvider.disabled}
              isOn={speechRecognizerService?.getHasRecognizer()}
              onChange={isOn =>
                isOn
                  ? speechRecognizerService?.startRecognizing()
                  : speechRecognizerService?.stopRecognizing()
              }
            />
          </Column>
          <Column>
            <LabeledToggle
              masterLabel="Control Desktop"
              disabled={
                !speechRecognizerService?.getHasRecognizer() ||
                speechProvider.disabled
              }
            />
          </Column>
        </Row>
      </Padding>
      {!speechProvider.disabled && (
        <div style={{ overflow: "auto" }}>
          <Padding>
            <SpeechActivityTable
              disabled={
                !speechRecognizerService?.getHasRecognizer() ||
                speechProvider.disabled
              }
              realTimeTranscription={speechRecognizerService?.getRealTimeTranscription()}
              finalizedTranscription={speechRecognizerService?.getFinalizedTranscription()}
            />
          </Padding>

          {apiKeyManagementService && (
            <Padding style={{ textAlign: "right" }}>
              {speechProvider.requiresAPIKey && (
                <>
                  <button
                    onClick={apiKeyManagementService.acquireAPIKey}
                    disabled={apiKeyManagementService.getHasCachedAPIKey()}
                  >
                    Set API Key
                  </button>{" "}
                  <button
                    onClick={apiKeyManagementService.deleteCachedAPIKey}
                    disabled={!apiKeyManagementService.getHasCachedAPIKey()}
                    style={{ backgroundColor: "red" }}
                  >
                    Delete API Key
                  </button>
                </>
              )}
            </Padding>
          )}
        </div>
      )}
      {speechProvider.serviceProviderURL && (
        <div className="note">
          Provider information:{" "}
          <ExternalLink href={speechProvider.serviceProviderURL}>
            {speechProvider.serviceProviderURL}
          </ExternalLink>
        </div>
      )}
    </Section>
  );
}
