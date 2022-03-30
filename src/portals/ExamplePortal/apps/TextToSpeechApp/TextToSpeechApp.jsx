import { useEffect } from "react";
import Center from "@components/Center";
import TextToSpeechService from "@services/TextToSpeechService";

export const REGISTRATION_ID = "text-to-speech";

const TextToSpeechApp = {
  id: REGISTRATION_ID,
  title: "Text to Speech",
  style: {
    width: 320,
    height: 320,
  },
  serviceClasses: [TextToSpeechService],
  view: function View({ appServices }) {
    const textToSpeechService = appServices[TextToSpeechService];
    const voices = textToSpeechService.getVoices();

    useEffect(() => {
      // TODO: Remove
      console.log({ voices });
    }, [voices]);

    return (
      <Center>
        <button
          onClick={() =>
            textToSpeechService.say("Hello, I would like to say a few words")
          }
        >
          Say "hello"
        </button>
      </Center>
    );
  },
};

export default TextToSpeechApp;
