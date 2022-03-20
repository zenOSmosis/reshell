import LabeledToggle from "@components/labeled/LabeledToggle";
import LabeledLED from "@components/labeled/LabeledLED/LabeledLED";

import WithoutRecognizer from "./views/WithoutRecognizer";
import WithRecognizer from "./views/WithRecognizer/WithRecognizer";

// Local services
import SpeechInputDesktopControllerService from "../../services/speechRecognition/SpeechInputDesktopControllerService";
import MesaSpeechRecognizerService from "../../services/speechRecognition/vendor/Mesa/MesaSpeechRecognizerService";
import MesaSubscriptionKeyManagementService from "../../services/speechRecognition/vendor/Mesa/MesaSubscriptionKeyManagementService";

import DesktopCommanderControllerService from "@services/DesktopCommanderControllerService";

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
    SpeechInputDesktopControllerService,
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
      appServices[SpeechInputDesktopControllerService];
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

  view: function View({ appServices }) {
    const desktopCommanderService =
      appServices[DesktopCommanderControllerService];

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

    // TODO: Use correct service
    /*
    const isDesktopControlEnabled =
      desktopControllerService.getIsDesktopControlEnabled();
    const lastCommand = desktopControllerService.getLastCommand();
    */

    // TODO: Include UI control for selecting between speech transcription engines (or using multiples at once)

    if (!hasRecognizer) {
      return (
        <WithoutRecognizer
          speechRecognizerService={speechRecognizerService}
          hasCachedSubscriptionKey={hasCachedSubscriptionKey}
          subscriptionKeyManagementService={subscriptionKeyManagementService}
        />
      );
    } else {
      const desktopControllerService =
        appServices[SpeechInputDesktopControllerService];

      const lastCommand = desktopCommanderService.getLastCommand();

      const transcriptionToRender = isRecognizing
        ? realTimeTranscription
        : finalizedTranscription;

      const isDesktopControlEnabled =
        desktopControllerService.getIsDesktopControlEnabled();

      return (
        <WithRecognizer
          desktopControllerService={desktopControllerService}
          lastCommand={lastCommand}
          transcriptionToRender={transcriptionToRender}
          isDesktopControlEnabled={isDesktopControlEnabled}
          onDesktopControlEnabledChange={
            desktopControllerService.setIsDesktopControlEnabled
          }
        />
      );
    }
  },
};

export default SpeechCommanderApp;
