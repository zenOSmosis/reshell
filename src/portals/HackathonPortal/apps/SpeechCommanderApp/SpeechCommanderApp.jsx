import { useMemo } from "react";

import Full from "@components/Full";
import Padding from "@components/Padding";
import Layout, { Content } from "@components/Layout";

import SpeechRecognizerSection from "./components/SpeechRecognizerSection";
import SpeechCommanderAppFooter from "./components/SpeechCommanderApp.Footer";

// import WithoutRecognizer from "./views/WithoutRecognizer";
// import WithRecognizer from "./views/WithRecognizer/WithRecognizer";

// Local services
import SpeechInputDesktopControllerService from "../../services/speechRecognition/SpeechInputDesktopControllerService";
import SpeechRecognizerCollectionService from "../../services/speechRecognition/SpeechRecognizerCollectionService";

import DesktopCommanderControllerService from "@services/DesktopCommanderControllerService";

export const REGISTRATION_ID = "speech-commander";

const SpeechCommanderApp = {
  id: REGISTRATION_ID,
  title: "Speech Commander",
  style: {
    width: 640 * 1.5,
    height: 480 * 1.5,
  },
  isAutoStart: true,
  serviceClasses: [
    SpeechRecognizerCollectionService,
    SpeechInputDesktopControllerService,
    DesktopCommanderControllerService,
  ],

  view: function View({ appServices }) {
    const collectionService = appServices[SpeechRecognizerCollectionService];

    const speechRecognitionServices =
      collectionService.getSpeechRecognizerServices();

    const speechRecognitionProviders = useMemo(() => {
      const providers = speechRecognitionServices.map(service => ({
        title: service.getTitle(),
        disabled: false,
      }));

      // TODO: Remove once native provider is implemented
      providers.push({
        title: "Native Speech Recognizer Service",
        disabled: true,
      });

      return providers;
    }, [speechRecognitionServices]);

    // TODO: Remove
    console.log({ speechRecognitionProviders, speechRecognitionServices });

    // TODO: Implement multiple speech recognizer input controls

    return (
      <Layout>
        <Content>
          <Full style={{ overflowY: "auto" }}>
            <Padding>
              <h1>Speech Recognition Providers</h1>

              <p className="note">
                Multiple speech recognition providers can be run concurrently.
              </p>

              {speechRecognitionProviders.map(provider => (
                <SpeechRecognizerSection
                  key={provider.title}
                  speechProvider={provider}
                />
              ))}
            </Padding>
          </Full>
        </Content>
        <SpeechCommanderAppFooter />
      </Layout>
    );
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
