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
    width: 640,
    height: 480,
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

    const isSpeaking = tts.getIsSpeaking();
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

    // TODO: Implement
    useEffect(() => {
      if (textInputValue) {
        posAnalyzer
          .applyModifiers(textInputValue, {
            nouns: {
              toSingular: true,
            },
          })
          .then(singularized => console.log({ singularized }));

        posAnalyzer
          .applyModifiers(textInputValue, {
            nouns: {
              toPlural: true,
            },
          })
          .then(pluralized => console.log({ pluralized }));

        posAnalyzer
          .applyModifiers(textInputValue, {
            verbs: {
              toFutureTense: true,
            },
          })
          .then(future => console.log({ future }));

        posAnalyzer
          .applyModifiers(textInputValue, {
            verbs: {
              toPastTense: true,
            },
          })
          .then(past => console.log({ past }));
      }
    }, [textInputValue, posAnalyzer]);

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
                      onClick={() => setTextInputValue("")}
                      disabled={!textInputValue}
                    >
                      Clear
                    </button>
                    <button
                      onClick={() =>
                        // TODO: Refactor accordingly
                        posAnalyzer.analyze(textInputValue)
                      }
                      disabled={!textInputValue}
                    >
                      Analyze
                    </button>
                  </Padding>
                </Section>
                <Section>
                  <h2>Modifiers</h2>
                  <div>
                    <Padding style={{ display: "inline-block" }}>
                      <input type="radio" name="tense" value="past" />{" "}
                      <label>Past</label>
                    </Padding>
                    <Padding style={{ display: "inline-block" }}>
                      <input type="radio" name="tense" value="present" />{" "}
                      <label>Present</label>
                    </Padding>
                    <Padding style={{ display: "inline-block" }}>
                      <input type="radio" name="tense" value="future" />{" "}
                      <label>Future</label>
                    </Padding>
                  </div>
                  <div>[...swap words]</div>
                </Section>
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
                        <select
                          // TODO: Refactor
                          value={tts.getDefaultVoice()?.voiceURI}
                          onChange={evt =>
                            // TODO: Refactor
                            tts.setDefaultVoice(
                              tts.getVoiceWithURI(evt.target.value)
                            )
                          }
                        >
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
                          disabled={!textInputValue || isSpeaking}
                        >
                          Say It
                        </button>
                        <button
                          onClick={() => tts.cancel()}
                          disabled={!isSpeaking}
                        >
                          Cancel
                        </button>
                        <Padding>
                          <label>Pitch</label>
                          <div>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step=".05"
                              value={tts.getDefaultPitch().toString()}
                              onChange={evt =>
                                tts.setDefaultPitch(
                                  parseFloat(evt.target.value)
                                )
                              }
                            />
                          </div>
                        </Padding>
                        <Padding>
                          <label>Rate</label>
                          <div>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step=".05"
                              value={tts.getDefaultRate().toString()}
                              onChange={evt =>
                                tts.setDefaultRate(parseFloat(evt.target.value))
                              }
                            />
                          </div>
                        </Padding>
                      </Padding>
                    </Center>
                  </Padding>
                </Section>
              </Full>
            </Column>
          </Row>
        </Content>
        <Footer>
          <Padding>[...]</Padding>
        </Footer>
      </Layout>
    );
  },
};

export default SayItDifferentApp;
