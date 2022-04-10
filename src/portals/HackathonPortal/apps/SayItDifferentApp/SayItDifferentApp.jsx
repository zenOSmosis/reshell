import { useEffect, useState } from "react";

import Full from "@components/Full";
import Padding from "@components/Padding";
import Layout, { Content, Footer, Row, Column } from "@components/Layout";
import Section from "@components/Section";
import Center from "@components/Center";
import AppLinkButton from "@components/AppLinkButton";
import LabeledToggle from "@components/labeled/LabeledToggle";

import ReadOnlyTextAreaButton from "./components/ReadOnlyTextAreaButton";

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

    const [textInputValue_singularized, setTextInputValue_singularized] =
      useState("");
    const [textInputValue_pluralized, setTextInputValue_pluralized] =
      useState("");
    const [textInputValue_future, setTextInputValue_future] = useState("");
    // const [textInputValue_present, setTextInputValue_present] = useState("");
    const [textInputValue_past, setTextInputValue_past] = useState("");

    // TODO: Document
    useEffect(() => {
      if (!hasRecognizer) {
        setIsTypingWithVoice(false);
      }
    }, [hasRecognizer]);

    // TODO: Document
    useEffect(() => {
      if (isTypingWithVoice) {
        setTextInputValue(realTimeTranscription || "");
      }
    }, [isTypingWithVoice, realTimeTranscription]);

    // TODO: Implement
    useEffect(() => {
      if (textInputValue) {
        posAnalyzer
          .applyTransformations(textInputValue, {
            nouns: {
              toSingular: true,
            },
          })
          .then(singularized => setTextInputValue_singularized(singularized));

        posAnalyzer
          .applyTransformations(textInputValue, {
            nouns: {
              toPlural: true,
            },
          })
          .then(pluralized => setTextInputValue_pluralized(pluralized));

        posAnalyzer
          .applyTransformations(textInputValue, {
            verbs: {
              toFutureTense: true,
            },
          })
          .then(future => setTextInputValue_future(future));

        posAnalyzer
          .applyTransformations(textInputValue, {
            verbs: {
              toPastTense: true,
            },
          })
          .then(past => setTextInputValue_past(past));
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
                  <h1>Transformers</h1>
                  {[
                    {
                      title: "Past",
                      value: textInputValue_past,
                    },
                    {
                      title: "Future",
                      value: textInputValue_future,
                    },
                    {
                      title: "Singular",
                      value: textInputValue_singularized,
                    },
                    {
                      title: "Plural",
                      value: textInputValue_pluralized,
                    },
                  ].map(data => {
                    const key = data.title;

                    return (
                      <Padding key={key}>
                        <ReadOnlyTextAreaButton
                          title={data.title}
                          value={data.value}
                          // TODO: Refactor accordingly
                          onClick={() => {
                            tts.say(data.value);
                          }}
                        />
                      </Padding>
                    );
                  })}

                  <div>[...swap words]</div>
                </Section>
                <Section>[...history]</Section>
              </Full>
            </Column>
            <Column style={{ maxWidth: 210 }}>
              <Full style={{ overflowY: "auto" }}>
                <Section>
                  <h1>Voice Input</h1>
                  <Padding>
                    <Center>
                      <Padding>
                        <AppLinkButton
                          title="Recognizers"
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
                  <h1>Voice Output</h1>
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
                              min="0.01"
                              max="1"
                              step=".05"
                              value={tts.getDefaultPitch().toString()}
                              onChange={evt =>
                                tts.setDefaultPitch(
                                  // TODO: If currently speaking, repeat current phrase (is it possible to adjust w/o restarting?)
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
                                // TODO: If currently speaking, repeat current phrase (is it possible to adjust w/o restarting?)
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
