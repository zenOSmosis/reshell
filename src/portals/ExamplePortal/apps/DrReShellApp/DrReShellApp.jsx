import { useState } from "react";

import CRT from "./components/CRT";
// import InputWithCustomCaret from "./components/InputWithCustomCaret";
import InputContainer from "./components/InputContainer";
import SimulatedTyper from "./components/SimulatedTyper";

import IntroView from "./views/IntroView";

import TextToSpeechService from "@services/TextToSpeechService";

// TODO: Borrow ideas from:
//  - https://codesandbox.io/s/crt-terminal-in-css-js-tlijm
//  - https://dev.to/ekeijl/retro-crt-terminal-screen-in-css-js-4afh
//  - https://github.com/zenOSmosis/reshell/issues/78
//
// [source code examples]
//  - https://everything2.com/title/ELIZA+source+code+in+BASIC
//  - https://github.com/codeanticode/eliza

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

    const [hasEntroEnded, setHasIntroEnded] = useState(false);

    // return <Center>Press any key to continue</Center>;
    return (
      <CRT>
        {!hasEntroEnded ? (
          <IntroView onEnd={() => setHasIntroEnded(true)} />
        ) : (
          <>
            <SimulatedTyper text="I would like to understand how and why you think this is necessary." />

            <InputContainer initialValue="> " />
          </>
        )}
      </CRT>
    );
  },
};

export default DrReShellApp;
