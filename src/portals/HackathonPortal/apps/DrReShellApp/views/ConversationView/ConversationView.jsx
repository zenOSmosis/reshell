import { useEffect, useState } from "react";

// import InputWithCustomCaret from "./components/InputWithCustomCaret";
import InputContainer from "../../components/InputContainer";
import SimulatedTyper from "../../components/SimulatedTyper";

import Layout, { Content, Footer } from "@components/Layout";
import Timer from "@components/Timer";

import DrReShellSession, {
  EVT_UPDATED,
  EVT_DESTROYED,
} from "../../classes/DrReShellSession.class";

import useForceUpdate from "@hooks/useForceUpdate";

// TODO: Document
// TODO: Add prop-types
export default function ConversationView({ posSpeechAnalyzer, onSessionEnd }) {
  const [session, _setSession] = useState(null);

  const forceUpdate = useForceUpdate();

  // Instantiate session
  useEffect(() => {
    const session = new DrReShellSession({ posSpeechAnalyzer });

    session.on(EVT_UPDATED, forceUpdate);

    _setSession(session);

    // Destruct session on unmount
    return () => session.destroy();
  }, [forceUpdate, posSpeechAnalyzer]);

  // Bind session termination handling
  useEffect(() => {
    if (session && typeof onSessionEnd === "function") {
      session.once(EVT_DESTROYED, onSessionEnd);

      return () => session.off(EVT_DESTROYED, onSessionEnd);
    }
  }, [session, onSessionEnd]);

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
          <div key={idx}>{line}</div>
        ))}

        <InputContainer
          key={session.getHistory().length}
          initialValue="> "
          onChange={session.processCharInput}
          onSubmit={session.processText}
        />
      </Content>
      <Footer>
        <button>Reset</button>

        <Timer onTick={session.getInstanceUptime} style={{ float: "right" }} />
      </Footer>
    </Layout>
  );
}
