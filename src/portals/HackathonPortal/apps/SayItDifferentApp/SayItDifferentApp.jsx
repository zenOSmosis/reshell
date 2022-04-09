import { useEffect, useState } from "react";

import Full from "@components/Full";
import Padding from "@components/Padding";
import Layout, { Content, Footer, Row, Column } from "@components/Layout";
import Section from "@components/Section";
import Center from "@components/Center";
import AppLinkButton from "@components/AppLinkButton";
import LabeledToggle from "@components/labeled/LabeledToggle";

import { REGISTRATION_ID as SPEECH_COMMANDER_REGISTRATION_ID } from "../SpeechCommanderApp";

// Local services
import SpeechRecognizerCollectionService from "../../services/speechRecognition/SpeechRecognizerCollectionService";
import PartOfSpeechAnalyzerService from "../../services/PartOfSpeechAnalyzerService";

import TextToSpeechService from "@services/TextToSpeechService";

export const REGISTRATION_ID = "say-it-different";

const SayItDifferentApp = {
  id: REGISTRATION_ID,
  title: "Say It Different",
  style: {
    width: 480,
    height: 320,
  },
  serviceClasses: [
    SpeechRecognizerCollectionService,
    TextToSpeechService,
    PartOfSpeechAnalyzerService,
  ],

  // TODO: Include load screen?

  view: function View({ appServices }) {
    /** @type {TextToSpeechService} */
    const tts = appServices[TextToSpeechService];

    /** @type {SpeechRecognizerCollectionService} */
    const stt = appServices[SpeechRecognizerCollectionService];

    /** @type {PartOfSpeechAnalyzerService} */
    const posAnalyzer = appServices[PartOfSpeechAnalyzerService];

    const localeVoices = tts.getLocaleVoices();

    const hasRecognizer = stt.getHasRecognizer();
    const realTimeTranscription = stt.getRealTimeTranscription();

    const [textInputValue, setTextInputValue] = useState("");
    const [isTypingWithVoice, setIsTypingWithVoice] = useState(false);

    // TODO: Document
    useEffect(() => {
      if (!hasRecognizer) {
        setIsTypingWithVoice(false);
      }
    }, [hasRecognizer]);

    // TODO: Document
    useEffect(() => {
      if (isTypingWithVoice) {
        setTextInputValue(realTimeTranscription);
      }
    }, [isTypingWithVoice, realTimeTranscription]);

    // TODO: Use part of speech servicing to diagram sentences and replace parts of
    // speech with relevant other words (or phrases)

    // TODO: Implement close-captioned service and show caption overlays

    // TODO: Allow text input as well

    // TODO: Show a robot?

    return (
      <Layout>
        <Content>
          <Row>
            <Column>
              <Full style={{ overflowY: "auto" }}>
                <Section>
                  <div>
                    <textarea
                      onChange={evt => setTextInputValue(evt.target.value)}
                      value={textInputValue}
                    >
                      {textInputValue}
                    </textarea>
                  </div>
                  <Padding style={{ textAlign: "right" }}>
                    <button
                      onClick={() =>
                        // TODO: Refactor accordingly
                        posAnalyzer.analyze(textInputValue)
                      }
                    >
                      Submit
                    </button>
                  </Padding>
                </Section>
                <Section>[...swap words]</Section>
                <Section>[...history]</Section>
              </Full>
            </Column>
            <Column style={{ maxWidth: 210 }}>
              <Full style={{ overflowY: "auto" }}>
                <Section>
                  <h2>Voice Input</h2>
                  <Padding>
                    <Center>
                      <Padding>
                        <AppLinkButton
                          title="Speech Input"
                          id={SPEECH_COMMANDER_REGISTRATION_ID}
                        />
                      </Padding>
                      <LabeledToggle
                        masterLabel="Type w/ Voice"
                        onChange={setIsTypingWithVoice}
                        isOn={isTypingWithVoice}
                        disabled={!hasRecognizer}
                      />
                    </Center>
                  </Padding>
                </Section>
                <Section>
                  <h2>Voice Output</h2>
                  <Padding>
                    <Center>
                      <Padding>
                        <select>
                          {localeVoices.map(voice => (
                            <option key={voice.voiceURI} value={voice.voiceURI}>
                              {voice.name}
                            </option>
                          ))}
                        </select>
                      </Padding>
                      <Padding>
                        <button
                          onClick={() => tts.say(textInputValue)}
                          disabled={!textInputValue}
                        >
                          Say It
                        </button>
                      </Padding>
                    </Center>
                  </Padding>
                </Section>
              </Full>
            </Column>
          </Row>
        </Content>
        <Footer>
          <Padding></Padding>
        </Footer>
      </Layout>
    );
  },
};

export default SayItDifferentApp;
