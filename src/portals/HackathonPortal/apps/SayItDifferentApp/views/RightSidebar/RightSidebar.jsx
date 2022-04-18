import Full from "@components/Full";
import Padding from "@components/Padding";
import { Column } from "@components/Layout";
import Section from "@components/Section";
import Center from "@components/Center";
import AppLinkButton from "@components/AppLinkButton";
import LabeledToggle from "@components/labeled/LabeledToggle";
import ButtonGroup from "@components/ButtonGroup";

import SentimentSection from "./SentimentSection";
import ShifterSection from "./ShifterSection";

import { REGISTRATION_ID as SPEECH_COMMANDER_REGISTRATION_ID } from "../../../SpeechCommanderApp";

export default function RightSidebar({
  text,
  sentiment,
  hasSpeechRecognizer,
  ttsService,
  posAnalyzer,
  localeVoices,
  isTypingWithVoice,
  onIsTypingWithVoiceChange,
  isSpeaking,
}) {
  return (
    <Column style={{ maxWidth: 210 }}>
      <Full style={{ overflowY: "auto" }}>
        <SentimentSection sentiment={sentiment} />
        <ShifterSection posAnalyzer={posAnalyzer} />
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
              {hasSpeechRecognizer && (
                <LabeledToggle
                  masterLabel="Type w/ Voice"
                  onChange={onIsTypingWithVoiceChange}
                  isOn={isTypingWithVoice}
                  disabled={!hasSpeechRecognizer}
                />
              )}
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
                  value={ttsService.getDefaultVoice()?.voiceURI}
                  onChange={evt =>
                    // TODO: Refactor
                    ttsService.setDefaultVoice(
                      ttsService.getVoiceWithURI(evt.target.value)
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
                    onClick={() => ttsService.say(text)}
                    disabled={!text || isSpeaking}
                  >
                    Say It
                  </button>
                  <button
                    onClick={() => ttsService.cancel()}
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
                      value={ttsService.getDefaultPitch().toString()}
                      onChange={evt =>
                        ttsService.setDefaultPitch(
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
                      value={ttsService.getDefaultRate().toString()}
                      onChange={evt =>
                        // TODO: If currently speaking, repeat current phrase (is it possible to adjust w/o restarting?)
                        ttsService.setDefaultRate(parseFloat(evt.target.value))
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
  );
}
