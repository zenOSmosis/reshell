import { useEffect, useState } from "react";

// import InputWithCustomCaret from "./components/InputWithCustomCaret";
import InputContainer from "../../components/InputContainer";
import SimulatedTyper from "../../components/SimulatedTyper";

import Layout, { Content, Footer } from "@components/Layout";

import DrReShellSession from "../../classes/DrReShellSession.class";

export default function ConversationView() {
  const [session, _setSession] = useState(null);

  useEffect(() => {
    const session = new DrReShellSession();

    _setSession(session);

    return () => session.destroy();
  }, []);

  return (
    <Layout>
      <Content>
        <SimulatedTyper text="I would like to understand how and why you think this is necessary." />

        <InputContainer initialValue="> " />
      </Content>
      {
        // TODO: Show timer?
      }
      <Footer>
        <button>Reset</button>
      </Footer>
    </Layout>
  );
}
