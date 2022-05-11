import { useCallback, useState } from "react";

import CRT from "./components/CRT";

import IntroView from "./views/IntroView";
import ConversationView from "./views/ConversationView";

// Global services
import TextToSpeechService from "@services/TextToSpeechService";

// Local services (to this portal)
import PartOfSpeechAnalyzerService from "../../services/PartOfSpeechAnalyzerService";

// TODO: Borrow ideas from:
//  - https://codesandbox.io/s/crt-terminal-in-css-js-tlijm
//  - https://dev.to/ekeijl/retro-crt-terminal-screen-in-css-js-4afh
//  - https://github.com/zenOSmosis/reshell/issues/78
//
// [source code examples]
//  - https://everything2.com/title/ELIZA+source+code+in+BASIC
//  - https://github.com/codeanticode/eliza
//  - [JS] https://github.com/oren/eliza-bot
//
// [possibly] Take a que from: https://archive.org/details/msdos_Planetfall_1983
//
// TODO: Use built-in TRS-80 fonts?

export const REGISTRATION_ID = "dr-reshell";

const DrReShellApp = {
  id: REGISTRATION_ID,
  title: "Doctor ReShell",
  style: {
    width: 640,
    height: 480,
  },
  serviceClasses: [TextToSpeechService, PartOfSpeechAnalyzerService],
  view: function View({ appServices }) {
    const ttsService = appServices[TextToSpeechService];
    const posSpeechAnalyzer = appServices[PartOfSpeechAnalyzerService];

    const [hasEntroEnded, setHasIntroEnded] = useState(false);

    const handleReset = useCallback(() => setHasIntroEnded(false), []);

    // return <Center>Press any key to continue</Center>;
    return (
      <CRT>
        {!hasEntroEnded ? (
          <IntroView onEnd={() => setHasIntroEnded(true)} />
        ) : (
          <ConversationView
            posSpeechAnalyzer={posSpeechAnalyzer}
            onReset={handleReset}
            ttsService={ttsService}
          />
        )}
      </CRT>
    );
  },
};

export default DrReShellApp;
