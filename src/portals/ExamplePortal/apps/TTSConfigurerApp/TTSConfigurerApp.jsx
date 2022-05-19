import Full from "@components/Full";
import Layout, { Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";
import StickyTable from "@components/StickyTable";

import TextToSpeechService from "@services/TextToSpeechService";

export const REGISTRATION_ID = "tts-configurer";

const HelloWorldApp = {
  id: REGISTRATION_ID,
  title: "TTS Configurer",
  style: {
    width: 640,
    height: 240,
  },
  serviceClasses: [TextToSpeechService],
  view: function View({ appServices }) {
    const ttsService = appServices[TextToSpeechService];

    const voices = ttsService.getLocaleVoices();
    const defaultVoice = ttsService.getDefaultVoice();

    return (
      <Layout>
        <Content>
          <Full style={{ overflowY: "auto" }}>
            <StickyTable>
              <thead>
                <tr>
                  <td>Default</td>
                  <td>Language</td>
                  <td>Name</td>
                  <td>Local?</td>
                </tr>
              </thead>
              <tbody>
                {voices.map((voice, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        type="checkbox"
                        checked={voice === defaultVoice}
                        onChange={evt =>
                          evt.target.checked &&
                          ttsService.setDefaultVoice(voice)
                        }
                      />
                    </td>
                    <td>{voice.lang}</td>
                    <td>
                      {voice.name}
                      {voice.voiceURI.includes("premium") ? ` (Premium)` : ``}
                    </td>
                    <td>{voice.localService ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </StickyTable>
          </Full>
        </Content>

        <Footer>
          <Padding>
            <button
              onClick={() => ttsService.say("hello")}
              disabled={ttsService.getIsSpeaking()}
            >
              Say "Hello"
            </button>
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default HelloWorldApp;
