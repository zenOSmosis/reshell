import Padding from "@components/Padding";
import Layout, { Header, Content } from "@components/Layout";
import MesaFooter from "./components/Footer";
import LabeledToggle from "@components/labeled/LabeledToggle";
import LabeledLED from "@components/labeled/LabeledLED/LabeledLED";
import Center from "@components/Center";
import AppLinkButton from "@components/AppLinkButton";

import WithoutRecognizer from "./views/WithoutRecognizer";

// Local services
import MesaSpeechDesktopControllerService from "../../services/MesaSpeechDesktopControllerService";
import MesaSpeechRecognizerService from "../../services/MesaSpeechRecognizerService";
import MesaSubscriptionKeyManagementService from "../../services/MesaSubscriptionKeyManagementService";

import DesktopCommanderControllerService from "@services/DesktopCommanderControllerService";

import { REGISTRATION_ID as COMMAND_DEBUGGER_REGISTRATION_ID } from "@portals/ExamplePortal/apps/DesktopCommanderDebuggerApp";

export const REGISTRATION_ID = "speech-commander";

const SpeechCommanderApp = {
  id: REGISTRATION_ID,
  title: "Speech Commander",
  style: {
    width: 640,
    height: 480,
  },
  isAutoStart: true,
  serviceClasses: [
    MesaSpeechDesktopControllerService,
    MesaSpeechRecognizerService,
    MesaSubscriptionKeyManagementService,
    DesktopCommanderControllerService,
  ],

  titleBarView: function TitleBarView({ appServices }) {
    const speechRecognizerService = appServices[MesaSpeechRecognizerService];
    const isConnecting = speechRecognizerService.getIsConnecting();
    const hasRecognizer = speechRecognizerService.getHasRecognizer();
    const isRecognizing = speechRecognizerService.getIsRecognizing();

    const desktopControllerService =
      appServices[MesaSpeechDesktopControllerService];
    const isDesktopControlEnabled =
      desktopControllerService.getIsDesktopControlEnabled();

    return (
      <div>
        <LabeledToggle
          masterLabel="Speech Recognition"
          isOn={hasRecognizer}
          onChange={isActive => {
            isActive
              ? speechRecognizerService.startRecognizing()
              : speechRecognizerService.stopRecognizing();
          }}
        />

        <LabeledLED
          color={
            !hasRecognizer
              ? "gray"
              : isConnecting
              ? "yellow"
              : isRecognizing
              ? "green"
              : "red"
          }
          style={{
            marginLeft: 10,
            // FIXME: (jh) Make all "labeled" components vertically aligned to
            // bottom?
            verticalAlign: "bottom",
          }}
          label="Talk Detection"
        />

        <LabeledLED
          color={
            !hasRecognizer ? "gray" : isDesktopControlEnabled ? "green" : "red"
          }
          style={{
            marginLeft: 10,
            // FIXME: (jh) Make all "labeled" components vertically aligned to
            // bottom?
            verticalAlign: "bottom",
          }}
          label="Desktop Control"
        />
      </div>
    );
  },

  view: function View({ appServices, sharedState, setSharedState }) {
    const desktopCommanderService =
      appServices[DesktopCommanderControllerService];
    const lastCommand = desktopCommanderService.getLastCommand();

    const subscriptionKeyManagementService =
      appServices[MesaSubscriptionKeyManagementService];
    const hasCachedSubscriptionKey =
      subscriptionKeyManagementService.getHasCachedSubscriptionKey();

    const speechRecognizerService = appServices[MesaSpeechRecognizerService];
    const hasRecognizer = speechRecognizerService.getHasRecognizer();
    // const finalizedTranscription =
    speechRecognizerService.getFinalizedTranscription();
    const isRecognizing = speechRecognizerService.getIsRecognizing();
    const realTimeTranscription =
      speechRecognizerService.getRealTimeTranscription();
    const finalizedTranscription =
      speechRecognizerService.getFinalizedTranscription();

    const desktopControllerService =
      appServices[MesaSpeechDesktopControllerService];

    // TODO: Use correct service
    /*
    const isDesktopControlEnabled =
      desktopControllerService.getIsDesktopControlEnabled();
    const lastCommand = desktopControllerService.getLastCommand();
    */

    const transcriptionToRender = isRecognizing
      ? realTimeTranscription
      : finalizedTranscription;

    if (!hasRecognizer) {
      return (
        <WithoutRecognizer
          speechRecognizerService={speechRecognizerService}
          hasCachedSubscriptionKey={hasCachedSubscriptionKey}
          subscriptionKeyManagementService={subscriptionKeyManagementService}
        />
      );
    } else {
      return (
        <Layout>
          <Header>
            <Padding style={{ textAlign: "center" }}>
              <div>
                <p>
                  Enable Desktop Speech Control to control ReShell with your
                  speech.
                </p>
                <LabeledToggle
                  isOn={desktopControllerService.getIsDesktopControlEnabled()}
                  onChange={desktopControllerService.setIsDesktopControlEnabled}
                  masterLabel="Desktop Speech Control"
                />
                <div style={{ marginLeft: 20, display: "inline-block" }}>
                  <AppLinkButton
                    id={COMMAND_DEBUGGER_REGISTRATION_ID}
                    style={{
                      // TODO: Use color variable for highlighted elements
                      backgroundColor: "#347fe8",
                    }}
                    title="View Example Phrases"
                  ></AppLinkButton>
                </div>
              </div>
            </Padding>
          </Header>
          <Content>
            <Padding>
              <Center>
                {transcriptionToRender && (
                  <span style={{ fontWeight: "bold" }}>
                    {transcriptionToRender}
                  </span>
                )}
                {lastCommand && (
                  <div
                    style={{ color: "green", marginTop: 10 }}
                    className="note"
                  >
                    Last command: {lastCommand.description}
                  </div>
                )}
              </Center>
            </Padding>
          </Content>
          <MesaFooter />
        </Layout>
      );
    }
  },
};

export default SpeechCommanderApp;
