import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import Padding from "@components/Padding";
// import ConversationView from "./views/ConversationView";

import CRT from "./components/CRT";

// TODO: Preload
import keySound from "./sounds/zNBy-key4.mp3";

import useKeyboardEvents from "@hooks/useKeyboardEvents";

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

    // Handle keyboard typing effect
    useKeyboardEvents(window, {
      onKeyDown: () => {
        // TODO: Don't send if not the active window (OR) bind to CRT display itself
        // TODO: Incorporate additional audio
        const s = new Audio(keySound);
        s.play();
      },
    });

    // TODO: Use "press key [or touch] to continue" to start system sounds

    // TODO: Use CRT effect

    // return <Center>Press any key to continue</Center>;
    return <CRT />;
  },
};

export default DrReShellApp;
