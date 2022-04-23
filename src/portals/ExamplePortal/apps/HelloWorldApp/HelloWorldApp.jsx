import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import Padding from "@components/Padding";

import styles from "./HelloWorldApp.module.css";

import TextToSpeechService from "@services/TextToSpeechService";

export const REGISTRATION_ID = "hello-world";

const HelloWorldApp = {
  id: REGISTRATION_ID,
  title: "Hello World",
  style: {
    width: 640,
    height: 480,
  },
  serviceClasses: [TextToSpeechService],
  view: function View({ appServices }) {
    const ttsService = appServices[TextToSpeechService];

    const text = "Hello World!";

    return (
      <Layout className={styles["hello-world-app"]}>
        <Content className={styles["main"]}>
          <Center>{text}</Center>
        </Content>

        <Footer>
          <Padding>
            <button
              onClick={() => ttsService.say(text)}
              disabled={ttsService.getIsSpeaking()}
            >
              Say It
            </button>
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default HelloWorldApp;
