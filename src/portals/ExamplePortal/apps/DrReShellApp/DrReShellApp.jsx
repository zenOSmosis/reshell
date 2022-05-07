import { useState } from "react";
import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import Padding from "@components/Padding";
// import ConversationView from "./views/ConversationView";

import CRT from "./components/CRT";
import InputWithCustomCaret from "./components/InputWithCustomCaret";

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
    const ttsService = appServices[TextToSpeechService];

    const [inputValue, setInputValue] = useState("> ");

    // return <Center>Press any key to continue</Center>;
    return (
      <CRT
        inputValue={inputValue}
        onInputValueChange={evt => setInputValue(evt.target.value)}
      >
        <div>What is your name?</div>
        <div>
          I would like to understand how and why you think this is necessary.
        </div>
        <InputWithCustomCaret
          value={inputValue}
          onChange={evt => setInputValue(evt.target.value)}
        />
      </CRT>
    );
  },
};

export default DrReShellApp;
