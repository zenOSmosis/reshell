import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// import InputWithCustomCaret from "./components/InputWithCustomCaret";
import InputContainer from "../../components/InputContainer";
import SimulatedTyper from "../../components/SimulatedTyper";

import Layout, { Header, Content, Footer } from "@components/Layout";
import Timer from "@components/Timer";

import DrReShellSessionEngine, {
  EVT_READY,
  EVT_UPDATED,
  EVT_DESTROYED,
  PHASE_AUTO_RESPONSE_TYPING,
  PHASE_AWAITING_USER_INPUT,
} from "../../engine/DrReShellSessionEngine";

import useForceUpdate from "@hooks/useForceUpdate";

// TODO: Document
// TODO: Add prop-types
export default function ConversationView({
  posSpeechAnalyzer,
  onSessionEnd,
  onReset,
  ttsService,
}) {
  const [session, _setSession] = useState(null);

  const forceUpdate = useForceUpdate();

  // Instantiate session
  useEffect(() => {
    const session = new DrReShellSessionEngine({ posSpeechAnalyzer });

    session.once(EVT_READY, forceUpdate);
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

  const refElScroller = useRef(null);

  const handleResponseTypingStart = useCallback(() => {
    if (sessionResponse && ttsService) {
      ttsService.say(sessionResponse);
    }
  }, [sessionResponse, ttsService]);

  if (!session?.getIsReady()) {
    return null;
  }

  // Automatically scroll thread to bottom
  if (refElScroller.current) {
    refElScroller.current.scrollTop = refElScroller.current.scrollHeight;
  }

  return (
    <Layout>
      <Header
        style={{ textAlign: "right", borderBottom: "1px #00b800 dashed" }}
      >
        Interactions: {session.getTotalInteractions()} | Overall Sentiment:{" "}
        {session.getSentiment()}
      </Header>
      <Content>
        <div
          ref={refElScroller}
          style={{ width: "100%", height: "100%", overflowY: "auto" }}
        >
          {session.getHistory().map((line, idx) => (
            <div key={idx}>{line || <span>&nbsp;</span>}</div>
          ))}

          {sessionResponse && phase === PHASE_AUTO_RESPONSE_TYPING && (
            <SimulatedTyper
              text={sessionResponse}
              onTypingStart={handleResponseTypingStart}
              onTypingEnd={handleAddAResponseToHistory}
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
        </div>
      </Content>
      <Footer>
        <button onClick={onReset}>Reset</button>

        <Timer onTick={session.getInstanceUptime} style={{ float: "right" }} />
      </Footer>
    </Layout>
  );
}
