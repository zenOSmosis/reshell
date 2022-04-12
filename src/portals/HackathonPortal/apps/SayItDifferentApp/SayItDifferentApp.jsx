// TODO: Integrate
// - https://github.com/kylestetz/Sentencer
// - https://www.ibm.com/docs/en/wca/3.5.0?topic=analytics-part-speech-tag-sets

import { useEffect, useState } from "react";

import Full from "@components/Full";
import Padding from "@components/Padding";
import Layout, {
  Header,
  Content,
  Footer,
  Row,
  Column,
} from "@components/Layout";
import Section from "@components/Section";
import Center from "@components/Center";
import AppLinkButton from "@components/AppLinkButton";
import LabeledToggle from "@components/labeled/LabeledToggle";
import ButtonGroup from "@components/ButtonGroup";
import AutoExpandingTextArea from "@components/AutoExpandingTextArea";

import ReadOnlyTextAreaButton from "./components/ReadOnlyTextAreaButton";

import { REGISTRATION_ID as SPEECH_COMMANDER_REGISTRATION_ID } from "../SpeechCommanderApp";

// Local services
import SpeechRecognizerCollectionService from "../../services/speechRecognition/SpeechRecognizerCollectionService";
import PartOfSpeechAnalyzerService from "../../services/PartOfSpeechAnalyzerService";

import TextToSpeechService from "@services/TextToSpeechService";

export const REGISTRATION_ID = "say-it-different";

// TODO: Implement ability to dynamically swap words

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

    // TODO: useObjectState for independent text renderings

    const [textInputValue, setTextInputValue] = useState("");
    const [isTypingWithVoice, setIsTypingWithVoice] = useState(false);

    const [syntaxTree, setSyntaxTree] = useState("");

    const [nouns, setNouns] = useState([]);
    const [verbs, setVerbs] = useState([]);

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

    // TODO: Document
    useEffect(() => {
      if (textInputValue) {
        posAnalyzer.fetchNouns(textInputValue).then(nouns => setNouns(nouns));
        posAnalyzer.fetchVerbs(textInputValue).then(verbs => setVerbs(verbs));

        posAnalyzer.fetchSyntaxTree(textInputValue).then(syntaxTree => {
          // TODO: Remove
          console.log({ syntaxTree });

          setSyntaxTree(syntaxTree);
        });

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
      } else {
        setSyntaxTree("");
        setNouns([]);
        setVerbs([]);

        setTextInputValue_singularized("");
        setTextInputValue_pluralized("");
        setTextInputValue_future("");
        //setTextInputValue_present('')
        setTextInputValue_past("");
      }
    }, [textInputValue, posAnalyzer]);

    // TODO: Use part of speech servicing to diagram sentences and replace parts of
    // speech with relevant other words (or phrases)

    // TODO: Implement close-captioned service and show caption overlays

    // TODO: Show a robot?

    return (
      <Layout>
        <Content>
          <Row>
            <Column>
              <Layout>
                <Header>
                  <Section>
                    <div>
                      <AutoExpandingTextArea
                        onChange={evt => setTextInputValue(evt.target.value)}
                        value={textInputValue}
                      >
                        {textInputValue}
                      </AutoExpandingTextArea>
                    </div>
                    <Padding style={{ textAlign: "right" }}>
                      <ButtonGroup>
                        <button
                          onClick={() => setTextInputValue("")}
                          disabled={!textInputValue}
                        >
                          Clear
                        </button>
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
                      </ButtonGroup>
                    </Padding>
                  </Section>
                </Header>
                <Content>
                  <Full style={{ overflowY: "auto" }}>
                    <Section>
                      <h1>Syntax Tree</h1>
                      <div>
                        <AutoExpandingTextArea value={syntaxTree} readOnly />
                      </div>
                    </Section>
                    <Section>
                      <h1>Parts of Speech</h1>
                      <Section>
                        <h2>Nouns</h2>
                        {nouns.map(noun => (
                          <button key={noun} onClick={() => tts.say(noun)}>
                            {noun}
                          </button>
                        ))}
                      </Section>
                      <Section>
                        <h2>Verbs</h2>
                        {verbs.map(verb => (
                          <button key={verb} onClick={() => tts.say(verb)}>
                            {verb}
                          </button>
                        ))}
                      </Section>
                    </Section>
                    <Section>
                      <h1>Transformations</h1>
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
                    </Section>
                  </Full>
                </Content>
              </Layout>
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
                        <ButtonGroup>
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
                        </ButtonGroup>
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
          <Padding className="note">
            {textInputValue.length} character
            {textInputValue.length !== 1 ? "s" : ""}
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default SayItDifferentApp;
