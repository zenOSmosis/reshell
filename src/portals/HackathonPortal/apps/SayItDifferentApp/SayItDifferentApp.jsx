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

import PartOfSpeechAnalysis from "./views/PartOfSpeechAnalysis";

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

    const [partsOfSpeech, setPartsOfSpeech] = useState([]);

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
        posAnalyzer.fetchPartsOfSpeech(textInputValue).then(partsOfSpeech => {
          setPartsOfSpeech(partsOfSpeech);
        });
      } else {
        setPartsOfSpeech([]);
      }
    }, [textInputValue, posAnalyzer]);

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
                  <PartOfSpeechAnalysis partsOfSpeech={partsOfSpeech} />
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
          {
            // TODO: Include navigation here
            //  - Part Of Speech
            //  - Syntax Tree
            //  - Sentiment Analysis
          }
        </Footer>
      </Layout>
    );
  },
};

export default SayItDifferentApp;
