import { useEffect, useMemo, useRef, useState } from "react";

import Padding from "@components/Padding";
import Layout, { Content, Footer } from "@components/Layout";
import Section from "@components/Section";
import Center from "@components/Center";
import AppLinkButton from "@components/AppLinkButton";

import { REGISTRATION_ID as SPEECH_COMMANDER_REGISTRATION_ID } from "../SpeechCommanderApp";

// Local services
import SpeechRecognizerCollectionService from "../../services/speechRecognition/SpeechRecognizerCollectionService";
import PartOfSpeechAnalyzerService from "../../services/PartOfSpeechAnalyzerService";

import TextToSpeechService from "@services/TextToSpeechService";

export const REGISTRATION_ID = "say-it-different";

// TODO: Show matched command

const SayItDifferentApp = {
  id: REGISTRATION_ID,
  title: "Say It Different",
  style: {
    width: 480,
    height: 320,
  },
  serviceClasses: [
    SpeechRecognizerCollectionService,
    PartOfSpeechAnalyzerService,
    TextToSpeechService,
  ],

  // TODO: Include load screen?

  view: function View({ appServices }) {
    const tts = appServices[TextToSpeechService];

    const [textInputValue, setTextInputValue] = useState("");

    useEffect(() => {}, [textInputValue]);

    // TODO: Use part of speech servicing to diagram sentences and replace parts of
    // speech with relevant other words (or phrases)

    // TODO: Implement close-captioned service and show caption overlays

    // TODO: Try to squeeze-in native speech-to-text API for sourcing

    // TODO: Allow text input as well

    return (
      <Layout>
        <Content>
          <Center canOverflow="true">
            <Section>
              <div>
                <textarea onChange={evt => setTextInputValue(evt.target.value)}>
                  {textInputValue}
                </textarea>
              </div>
              <Padding style={{ textAlign: "right" }}>
                <button
                  onClick={() => tts.say(textInputValue)}
                  disabled={!textInputValue}
                  style={{ float: "left" }}
                >
                  Say It
                </button>
                <button>Submit</button>
              </Padding>
            </Section>
            <Section>new</Section>
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

export default SayItDifferentApp;
