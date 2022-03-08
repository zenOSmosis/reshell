import Padding from "@components/Padding";
import Layout, { Header, Content } from "@components/Layout";
import MesaFooter from "./components/Footer";
import LabeledToggle from "@components/labeled/LabeledToggle";
import LabeledLED from "@components/labeled/LabeledLED/LabeledLED";

// Local services
import MesaSpeechDesktopControllerService from "../../services/MesaSpeechDesktopControllerService";
import MesaSpeechRecognizerService from "../../services/MesaSpeechRecognizerService";
import MesaSubscriptionKeyManagementService from "../../services/MesaSubscriptionKeyManagementService";

import WithoutRecognizer from "./views/WithoutRecognizer";

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
  ],

  titleBarView: function TitleBarView({ appServices }) {
    const speechRecognizerService = appServices[MesaSpeechRecognizerService];
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
          color={!hasRecognizer ? "gray" : isRecognizing ? "green" : "red"}
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
    const subscriptionKeyManagementService =
      appServices[MesaSubscriptionKeyManagementService];
    const hasCachedSubscriptionKey =
      subscriptionKeyManagementService.getHasCachedSubscriptionKey();

    const speechRecognizerService = appServices[MesaSpeechRecognizerService];
    const hasRecognizer = speechRecognizerService.getHasRecognizer();
    // const finalizedTranscription =
    speechRecognizerService.getFinalizedTranscription();
    // const isRecognizing = speechRecognizerService.getIsRecognizing();

    const desktopControllerService =
      appServices[MesaSpeechDesktopControllerService];

    // TODO: Use correct service
    /*
    const isDesktopControlEnabled =
      desktopControllerService.getIsDesktopControlEnabled();
    const lastCommand = desktopControllerService.getLastCommand();
    */

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
              <p>
                Enable Desktop Speech Control to control ReShell with your
                speech.
              </p>
              <LabeledToggle
                isOn={desktopControllerService.getIsDesktopControlEnabled()}
                onChange={desktopControllerService.setIsDesktopControlEnabled}
                masterLabel="Desktop Speech Control"
              />
            </Padding>
          </Header>
          <Content>
            <Padding>
              {/*
                <p>TODO: Implement "What can I say?" feature</p>
                <p>TODO: Show capture status</p>

                <p>
                  Last command: {lastCommand ? lastCommand.description : "N/A"}
                </p>
                */}
            </Padding>
          </Content>
          <MesaFooter />
        </Layout>
      );
    }
  },
};

export default SpeechCommanderApp;
