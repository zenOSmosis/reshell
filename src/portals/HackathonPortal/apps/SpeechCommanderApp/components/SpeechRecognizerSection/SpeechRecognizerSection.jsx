import Section from "@components/Section";
import Padding from "@components/Padding";
import LabeledToggle from "@components/labeled/LabeledToggle";
import LabeledLED from "@components/labeled/LabeledLED";
import { Row, Column } from "@components/Layout";
import Timer from "@components/Timer";
import ExternalLink from "@components/ExternalLink";

import SpeechActivityTable from "../SpeechActivityTable";

// FIXME: Show simple / advanced views?
// TODO: Add prop-types
// TODO: Document
export default function SpeechRecognizerSection({ speechProvider }) {
  const speechRecognizerService = speechProvider.speechRecognizerService;
  const apiKeyManagementService = speechProvider.apiKeyManagementService;

  return (
    <Section>
      {!speechProvider.disabled && (
        <div style={{ position: "absolute", top: 4, left: 8 }}>
          <Timer
            onTick={() => speechRecognizerService?.getRecognizerUptime()}
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
              <>
                <LabeledLED
                  label="Connection"
                  color={
                    !speechRecognizerService?.getHasRecognizer()
                      ? "gray"
                      : speechRecognizerService?.getIsConnecting()
                      ? "yellow"
                      : speechRecognizerService?.getIsConnected()
                      ? "green"
                      : "red"
                  }
                />
                <LabeledLED
                  label="Voice Activity"
                  color={
                    !speechRecognizerService?.getHasRecognizer()
                      ? "gray"
                      : speechRecognizerService?.getIsRecognizing()
                      ? "green"
                      : "red"
                  }
                />
              </>
            ) : (
              <span className="note">{speechProvider.status}</span>
            )}
          </div>
        </div>
      )}

      <div style={{ marginTop: 14 }}>
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
                isOn={speechRecognizerService?.getIsControllingDesktop()}
                onChange={speechRecognizerService?.setIsControllingDesktop}
                disabled={
                  !speechRecognizerService?.getHasRecognizer() ||
                  speechProvider.disabled
                }
              />
            </Column>
          </Row>
        </Padding>
      </div>
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
                    style={{ backgroundColor: "#CD1F2A" }}
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
