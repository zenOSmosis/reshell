import Padding from "@components/Padding";
import Layout, {
  Header,
  Content,
  Footer,
  Row,
  Column,
} from "@components/Layout";
import AppLinkButton from "@components/AppLinkButton";
import LabeledLED from "@components/labeled/LabeledLED/LabeledLED";
import ButtonGroup from "@components/ButtonGroup";

import { REGISTRATION_ID as INPUT_MEDIA_DEVICES_REGISTRATION_ID } from "@portals/ExamplePortal/apps/InputMediaDevicesApp";
import { REGISTRATION_ID as KEY_VAULT_REGISTRATION_ID } from "@portals/ExamplePortal/apps/KeyVaultApp";
import { REGISTRATION_ID as COMMAND_DEBUGGER_REGISTRATION_ID } from "@portals/ExamplePortal/apps/DesktopCommanderDebuggerApp";

// Local services
import MesaSpeechRecognizerService from "../../services/speechRecognition/vendor/Mesa/MesaSpeechRecognizerService";
import MesaSubscriptionKeyManagementService from "../../services/speechRecognition/vendor/Mesa/MesaSubscriptionKeyManagementService";
import SpeechInputDesktopControllerService from "../../services/speechRecognition/SpeechInputDesktopControllerService";

// TODO: Show input selector for which device to recognize from (if
// there are more than one active audio input device)

// TODO: Add push-to-talk support for speech recognizer?

export const REGISTRATION_ID = "mesa-speech-recognition-debugger";

const MesaSpeechRecognitionDebuggerApp = {
  id: REGISTRATION_ID,
  title: "Mesa Speech Recognition Debugger",
  style: {
    width: 640,
    height: 320,
  },
  serviceClasses: [
    MesaSpeechRecognizerService,
    MesaSubscriptionKeyManagementService,
    SpeechInputDesktopControllerService,
  ],
  /*
  titleBarView: function TitleBarView({ sharedState, setSharedState }) {
  },
  */
  view: function View({ appServices }) {
    const speechRecognizerService = appServices[MesaSpeechRecognizerService];
    const isConnecting = speechRecognizerService.getIsConnecting();
    const hasRecognizer = speechRecognizerService.getHasRecognizer();
    const finalizedTranscription =
      speechRecognizerService.getFinalizedTranscription();
    const isRecognizing = speechRecognizerService.getIsRecognizing();
    const realTimeTranscription =
      speechRecognizerService.getRealTimeTranscription();

    const keyManagementService =
      appServices[MesaSubscriptionKeyManagementService];
    const hasSubscriptionKey =
      keyManagementService.getHasCachedSubscriptionKey();

    const desktopControllerService =
      appServices[SpeechInputDesktopControllerService];
    const isDesktopControlEnabled =
      desktopControllerService.getIsDesktopControlEnabled();

    return (
      <Layout>
        <Header>
          <Padding>
            <button
              onClick={() =>
                hasRecognizer
                  ? speechRecognizerService.stopRecognizing()
                  : speechRecognizerService.startRecognizing()
              }
              style={{ backgroundColor: hasRecognizer ? "red" : "green" }}
            >
              {hasRecognizer ? "Stop" : "Start"} Recognizing
            </button>

            <button
              onClick={keyManagementService.deleteCachedSubscriptionKey}
              disabled={!hasSubscriptionKey}
              style={{ float: "right", backgroundColor: "red" }}
            >
              Delete Cached Subscription Key
            </button>
          </Padding>
        </Header>
        <Content>
          <Padding style={{ overflowY: "auto" }}>
            <Row disableVerticalFill style={{ height: 80 }}>
              <Column
                style={{
                  border: "1px #999 solid",
                  borderRadius: 4,
                  backgroundColor: "rgba(0,0,0,.4)",
                }}
              >
                <Padding>
                  <Layout>
                    <Content>
                      <div>{realTimeTranscription || "N/A"}</div>
                    </Content>
                    <Footer>
                      <div
                        style={{
                          fontStyle: "italic",
                          fontSize: ".9em",
                          color: "gray",
                        }}
                      >
                        Real-time
                      </div>
                    </Footer>
                  </Layout>
                </Padding>
              </Column>
              <Column
                style={{
                  border: "1px #999 solid",
                  borderRadius: 4,
                  backgroundColor: "rgba(0,0,0,.4)",
                }}
              >
                <Padding>
                  <Layout>
                    <Content>
                      <div>{finalizedTranscription || "N/A"}</div>
                    </Content>
                    <Footer>
                      <div
                        style={{
                          fontStyle: "italic",
                          fontSize: ".9em",
                          color: "gray",
                        }}
                      >
                        Finalized
                      </div>
                    </Footer>
                  </Layout>
                </Padding>
              </Column>
            </Row>

            <div
              style={{ overflow: "auto", textAlign: "center", marginTop: 20 }}
            >
              <Padding>
                <Padding style={{ display: "inline-block" }}>
                  <LabeledLED
                    color={!isDesktopControlEnabled ? "gray" : "green"}
                    label="Desktop Controller"
                  />
                </Padding>

                <Padding style={{ display: "inline-block" }}>
                  <LabeledLED
                    color={!hasSubscriptionKey ? "gray" : "green"}
                    label="Subscription Key"
                  />
                </Padding>

                <Padding style={{ display: "inline-block" }}>
                  <LabeledLED
                    color={
                      !hasRecognizer
                        ? "gray"
                        : isConnecting
                        ? "yellow"
                        : "green"
                    }
                    label="Recognizer Engine"
                  />
                </Padding>
                <Padding style={{ display: "inline-block" }}>
                  <LabeledLED
                    color={
                      !hasRecognizer ? "gray" : isRecognizing ? "green" : "red"
                    }
                    label="Speech Detection"
                  />
                </Padding>
              </Padding>
            </div>
          </Padding>
        </Content>

        <Footer>
          <Padding style={{ textAlign: "center" }}>
            <ButtonGroup>
              <AppLinkButton id={INPUT_MEDIA_DEVICES_REGISTRATION_ID} />
              <AppLinkButton id={KEY_VAULT_REGISTRATION_ID} />
              <AppLinkButton id={COMMAND_DEBUGGER_REGISTRATION_ID} />
            </ButtonGroup>
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default MesaSpeechRecognitionDebuggerApp;
