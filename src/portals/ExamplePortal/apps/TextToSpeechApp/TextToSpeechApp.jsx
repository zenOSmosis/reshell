import { useEffect, useState } from "react";

import Padding from "@components/Padding";
import Layout, { Content, Footer, Row, Column } from "@components/Layout";
import Section from "@components/Section";
import Center from "@components/Center";
import AppLinkButton from "@components/AppLinkButton";
import LabeledToggle from "@components/labeled/LabeledToggle";

// TODO: Move these to ExamplePortal
import { REGISTRATION_ID as SPEECH_COMMANDER_REGISTRATION_ID } from "@portals/HackathonPortal/apps/SpeechCommanderApp";
import SpeechRecognizerCollectionService from "@portals/HackathonPortal/services/speechRecognition/SpeechRecognizerCollectionService";

import TextToSpeechService from "@services/TextToSpeechService";

export const REGISTRATION_ID = "text-to-speech";

const TextToSpeechApp = {
  id: REGISTRATION_ID,
  title: "Text to Speech",
  style: {
    width: 480,
    height: 320,
  },
  serviceClasses: [SpeechRecognizerCollectionService, TextToSpeechService],

  view: function View({ appServices }) {
    const tts = appServices[TextToSpeechService];
    const stt = appServices[SpeechRecognizerCollectionService];

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

    return (
      <Layout>
        <Content>
          <Center canOverflow={true}>
            <Section>
              <div>
                <textarea
                  onChange={evt => setTextInputValue(evt.target.value)}
                  value={textInputValue}
                >
                  {textInputValue}
                </textarea>
              </div>
              <Padding>
                <Row disableVerticalFill>
                  <Column>
                    <LabeledToggle
                      masterLabel="Type w/ Voice"
                      style={{ float: "left" }}
                      onChange={setIsTypingWithVoice}
                      isOn={isTypingWithVoice}
                      disabled={!hasRecognizer}
                    />
                  </Column>
                  <Column disableHorizontalFill>
                    <button
                      onClick={() => tts.say(textInputValue)}
                      disabled={!textInputValue}
                      style={{ float: "left" }}
                    >
                      Say It
                    </button>
                  </Column>
                </Row>
              </Padding>
            </Section>
          </Center>
        </Content>
        <Footer>
          <Padding>
            <AppLinkButton
              title="Speech Input"
              id={SPEECH_COMMANDER_REGISTRATION_ID}
            />
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default TextToSpeechApp;
