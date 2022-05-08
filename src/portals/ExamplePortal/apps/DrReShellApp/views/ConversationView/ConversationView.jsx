import { useEffect, useState } from "react";

// import InputWithCustomCaret from "./components/InputWithCustomCaret";
import InputContainer from "../../components/InputContainer";
import SimulatedTyper from "../../components/SimulatedTyper";

import Layout, { Content, Footer } from "@components/Layout";
import Timer from "@components/Timer";

import DrReShellSession, {
  EVT_UPDATED,
} from "../../classes/DrReShellSession.class";

import useForceUpdate from "@hooks/useForceUpdate";

export default function ConversationView() {
  const [session, _setSession] = useState(null);

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const session = new DrReShellSession();

    session.on(EVT_UPDATED, forceUpdate);

    _setSession(session);

    return () => session.destroy();
  }, [forceUpdate]);

  if (!session) {
    return null;
  }

  return (
    <Layout>
      <Content>
        {
          // TODO: Only show if responding
        }
        <SimulatedTyper text={session.getResponse()} />

        {session.getHistory().map((line, idx) => (
          <div idx={idx}>{line}</div>
        ))}

        <InputContainer
          initialValue="> "
          // onChange={session.processTextInput}
          onSubmit={session.processTextInput}
        />
      </Content>
      {
        // TODO: Show timer?
      }
      <Footer>
        <button>Reset</button>

        <Timer onTick={session.getInstanceUptime} style={{ float: "right" }} />
      </Footer>
    </Layout>
  );
}
