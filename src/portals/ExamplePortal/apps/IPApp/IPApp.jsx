import { useEffect } from "react";
import axios from "axios";

import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import Padding from "@components/Padding";

export const REGISTRATION_ID = "ip";

const HelloWorldApp = {
  id: REGISTRATION_ID,
  title: "IP",
  style: {
    width: 640,
    height: 480,
  },
  view: function View() {
    useEffect(() => {
      axios
        .get("https://www.cloudflare.com/cdn-cgi/trace")
        .then(resp => resp.data)
        // TODO: Parse this and display in UI
        .then(data => console.log(data.split("\n")));
    }, []);

    return (
      <Layout>
        <Content>
          <Center>
            [TODO: Integrate call to https://www.cloudflare.com/cdn-cgi/trace]
          </Center>
        </Content>

        <Footer>
          <Padding>
            <button
            // onClick={() => ttsService.say(text)}
            // disabled={ttsService.getIsSpeaking()}
            >
              Refetch
            </button>
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default HelloWorldApp;
