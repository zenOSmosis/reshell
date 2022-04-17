import { useEffect, useState } from "react";

import Padding from "@components/Padding";
import Layout, { Header, Content, Row, Column } from "@components/Layout";
import Section from "@components/Section";
import ButtonGroup from "@components/ButtonGroup";
import ButtonPanel from "@components/ButtonPanel";
import Full from "@components/Full";

import RightSidebar from "./views/RightSidebar";
import PartOfSpeechAnalysis from "./views/PartOfSpeechAnalysis";
import SyntaxTree from "./views/SyntaxTree";
import NoData from "./views/NoData";

// Local services
import SpeechRecognizerCollectionService from "../../services/speechRecognition/SpeechRecognizerCollectionService";
import PartOfSpeechAnalyzerService from "../../services/PartOfSpeechAnalyzerService";

import TextToSpeechService from "@services/TextToSpeechService";

export const REGISTRATION_ID = "say-it-different";

// TODO: Implement ability to dynamically swap words
// TODO: Include load screen?
// TODO: useObjectState for independent text renderings

const DATA_VIEW_PART_OF_SPEECH = "partOfSpeech";
const DATA_VIEW_SYNTAX_TREE = "syntaxTree";

const DEFAULT_TEXT_INPUT_VALUE = "Welcome to ReShell.";

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

  view: function View({ appServices }) {
    const [dataView, setDataView] = useState(DATA_VIEW_PART_OF_SPEECH);

    /** @type {TextToSpeechService} */
    const tts = appServices[TextToSpeechService];

    /** @type {SpeechRecognizerCollectionService} */
    const stt = appServices[SpeechRecognizerCollectionService];

    /** @type {PartOfSpeechAnalyzerService} */
    const posAnalyzer = appServices[PartOfSpeechAnalyzerService];

    const isSpeaking = tts.getIsSpeaking();
    const localeVoices = tts.getLocaleVoices();

    const hasSpeechRecognizer = stt.getHasRecognizer();
    const realTimeTranscription = stt.getRealTimeTranscription();

    const [textInputValue, setTextInputValue] = useState(
      DEFAULT_TEXT_INPUT_VALUE
    );
    const [isTypingWithVoice, setIsTypingWithVoice] = useState(false);

    const isEmpty = !textInputValue.length;

    // TODO: Document
    useEffect(() => {
      if (!hasSpeechRecognizer) {
        setIsTypingWithVoice(false);
      }
    }, [hasSpeechRecognizer]);

    // TODO: Document
    useEffect(() => {
      if (isTypingWithVoice) {
        setTextInputValue(realTimeTranscription || "");
      }
    }, [isTypingWithVoice, realTimeTranscription]);

    return (
      <Layout>
        <Content>
          <Row>
            <Column>
              <Layout>
                <Header>
                  <Section>
                    <div>
                      <textarea
                        onChange={evt => setTextInputValue(evt.target.value)}
                        value={textInputValue}
                      >
                        {textInputValue}
                      </textarea>
                    </div>
                    <Padding style={{ float: "left" }} className="note">
                      {textInputValue.length} character
                      {textInputValue.length !== 1 ? "s" : ""}
                    </Padding>
                    <Padding style={{ float: "right" }}>
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
                  <Layout>
                    <Header>
                      <Padding>
                        <ButtonPanel
                          buttons={[
                            {
                              content: "Part Of Speech",
                              disabled: isEmpty,
                              onClick: () =>
                                setDataView(DATA_VIEW_PART_OF_SPEECH),
                            },
                            {
                              content: "Syntax Tree",
                              disabled: isEmpty,
                              onClick: () => setDataView(DATA_VIEW_SYNTAX_TREE),
                            },
                          ]}
                        />
                      </Padding>
                    </Header>
                    <Content>
                      <Padding>
                        <Full
                          style={{
                            border: "1px #999 solid",
                            borderRadius: "8px",
                            backgroundColor: "rgba(0,0,0,.2)",
                          }}
                        >
                          {isEmpty ? (
                            <NoData />
                          ) : (
                            <>
                              {(() => {
                                switch (dataView) {
                                  case DATA_VIEW_PART_OF_SPEECH:
                                    return (
                                      <PartOfSpeechAnalysis
                                        posAnalyzer={posAnalyzer}
                                        text={textInputValue}
                                      />
                                    );

                                  case DATA_VIEW_SYNTAX_TREE:
                                    return (
                                      <SyntaxTree
                                        posAnalyzer={posAnalyzer}
                                        text={textInputValue}
                                      />
                                    );

                                  default:
                                    return null;
                                }
                              })()}
                            </>
                          )}
                        </Full>
                      </Padding>
                    </Content>
                  </Layout>
                </Content>
              </Layout>
            </Column>
            <RightSidebar
              text={textInputValue}
              ttsService={tts}
              hasSpeechRecognizer={hasSpeechRecognizer}
              localeVoices={localeVoices}
              isTypingWithVoice={isTypingWithVoice}
              onIsTypingWithVoiceChange={setIsTypingWithVoice}
              isSpeaking={isSpeaking}
            />
          </Row>
        </Content>
      </Layout>
    );
  },
};

export default SayItDifferentApp;
