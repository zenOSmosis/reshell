import { useState } from "react";

import CRT from "./components/CRT";
import InputWithCustomCaret from "./components/InputWithCustomCaret";
import SimulatedTyper from "./components/SimulatedTyper";

import IntroView from "./views/IntroView";

import TextToSpeechService from "@services/TextToSpeechService";

// TODO: Borrow ideas from:
//  - https://codesandbox.io/s/crt-terminal-in-css-js-tlijm
//  - https://dev.to/ekeijl/retro-crt-terminal-screen-in-css-js-4afh

export const REGISTRATION_ID = "dr-reshell";

const DrReShellApp = {
  id: REGISTRATION_ID,
  title: "Doctor ReShell",
  style: {
    width: 640,
    height: 480,
  },
  serviceClasses: [TextToSpeechService],
  view: function View({ appServices }) {
    // TODO: Integrate TTS processing
    const ttsService = appServices[TextToSpeechService];

    const [inputValue, setInputValue] = useState("> ");

    const [hasEntroEnded, setHasIntroEnded] = useState(false);

    // return <Center>Press any key to continue</Center>;
    return (
      <CRT
        inputValue={inputValue}
        onInputValueChange={evt => setInputValue(evt.target.value)}
      >
        {!hasEntroEnded ? (
          <IntroView onEnd={() => setHasIntroEnded(true)} />
        ) : (
          <>
            <SimulatedTyper text="I would like to understand how and why you think this is necessary." />

            <InputWithCustomCaret
              value={inputValue}
              onChange={evt => setInputValue(evt.target.value)}
            />
          </>
        )}
      </CRT>
    );
  },
};

export default DrReShellApp;
