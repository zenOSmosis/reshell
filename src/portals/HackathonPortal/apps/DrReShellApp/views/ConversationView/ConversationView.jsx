import { useCallback, useEffect, useMemo, useState } from "react";

// import InputWithCustomCaret from "./components/InputWithCustomCaret";
import InputContainer from "../../components/InputContainer";
import SimulatedTyper from "../../components/SimulatedTyper";

import Layout, { Header, Content, Footer } from "@components/Layout";
import Timer from "@components/Timer";

import DrReShellSession, {
  EVT_UPDATED,
  EVT_DESTROYED,
  PHASE_AUTO_RESPONSE_TYPING,
  PHASE_AWAITING_USER_INPUT,
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

  const phase = session?.getPhase();

  const sessionResponse = useMemo(
    () => phase === PHASE_AUTO_RESPONSE_TYPING && session?.getResponse(),
    [session, phase]
  );

  const handleAddAResponseToHistory = useCallback(() => {
    session?.addResponseToHistory(sessionResponse);
  }, [session, sessionResponse]);

  if (!session) {
    return null;
  }

  return (
    <Layout>
      <Header
        style={{ textAlign: "right", borderBottom: "1px #00b800 dashed" }}
      >
        {
          // TODO: Handle this
        }
        Interactions: {session.getTotalInteractions()} | Overall Sentiment:
        Neutral
      </Header>
      <Content>
        {session.getHistory().map((line, idx) => (
          <div key={idx}>{line || <span>&nbsp;</span>}</div>
        ))}

        {sessionResponse && phase === PHASE_AUTO_RESPONSE_TYPING && (
          <SimulatedTyper
            text={sessionResponse}
            onEnd={handleAddAResponseToHistory}
          />
        )}

        {phase === PHASE_AWAITING_USER_INPUT && (
          <InputContainer
            key={session.getHistory().length}
            initialValue="> "
            onChange={session.processCharInput}
            onSubmit={session.processText}
          />
        )}
      </Content>
      <Footer>
        <button>Reset</button>

        <Timer onTick={session.getInstanceUptime} style={{ float: "right" }} />
      </Footer>
    </Layout>
  );
}
