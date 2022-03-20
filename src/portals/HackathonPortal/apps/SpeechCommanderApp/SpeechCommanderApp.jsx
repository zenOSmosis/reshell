// import LabeledToggle from "@components/labeled/LabeledToggle";
// import LabeledLED from "@components/labeled/LabeledLED/LabeledLED";

// import WithoutRecognizer from "./views/WithoutRecognizer";
// import WithRecognizer from "./views/WithRecognizer/WithRecognizer";

// Local services
import SpeechInputDesktopControllerService from "../../services/speechRecognition/SpeechInputDesktopControllerService";

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
    DesktopCommanderControllerService,
  ],

  view: function View({ appServices }) {
    // TODO: Implement multiple speech recognizer input controls
  },

  /*
  OLD_titleBarView: function TitleBarView({ appServices }) {
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
  */
};

export default SpeechCommanderApp;
