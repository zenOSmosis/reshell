import { getUptime } from "phantom-core";

import { useEffect } from "react";

import AppRuntimeTable from "./AppRuntime.Table";

import Center from "@components/Center";
import Padding from "@components/Padding";
import Layout, { Content, Footer } from "@components/Layout";
import Timer from "@components/Timer";
import AppLinkButton from "@components/AppLinkButton";

import { REGISTRATION_ID as SERVICE_MONITOR_REGISTRATION_ID } from "../ServiceMonitorApp";

import useDesktopContext from "@hooks/useDesktopContext";
import useAppOrchestrationContext from "@hooks/useAppOrchestrationContext";

export const REGISTRATION_ID = "application-monitor";

const ApplicationMonitorApp = {
  id: REGISTRATION_ID,
  title: "Application Monitor",
  style: {
    width: 640,
    height: 480,
  },
  isPinned: true,
  view: function View() {
    const { appRuntimes } = useAppOrchestrationContext();
    const { isProfiling, setIsProfiling } = useDesktopContext();

    // Automatically disable profiling when unmounting
    useEffect(() => {
      if (isProfiling) {
        return () => setIsProfiling(false);
      }
    }, [isProfiling, setIsProfiling]);

    // TODO: Determine if profiler is available in the current environment

    // TODO: Group by registration
    // TODO: Show attached services, per application
    // TODO: Show last render time / frequency / graph?
    // TODO: Implement ability to record render profile intervals, with the ability to show them in a graph (per application; use legend)
    // TODO: Implement ability to show how linked services affect render profiles; capture in recordings
    // TODO: Implement ability to do call stack tracing (only when recording)

    if (!isProfiling) {
      return (
        <Center>
          <div>
            <p style={{ fontWeight: "bold" }}>
              Application Profiling is experimental!
            </p>

            <ol
              style={{
                maxWidth: 500,
                textAlign: "left",
                display: "inline-block",
              }}
            >
              <li>
                Each window may lose its current state once profiling is
                enabled.
              </li>
              <li>
                Also, once enabled and closing this application, the state may
                be lost again!
              </li>
            </ol>

            <p className="note" style={{ fontWeight: "bold" }}>
              Profiling will be disabled once closing this window.
            </p>

            <Padding>
              <button
                onClick={() => setIsProfiling(true)}
                style={{ backgroundColor: "red" }}
              >
                Enable Profiling
              </button>
            </Padding>
          </div>
        </Center>
      );
    }

    return (
      <Layout>
        <Content>
          <Padding style={{ overflowY: "auto" }}>
            <AppRuntimeTable appRuntimes={appRuntimes} />
          </Padding>
        </Content>
        <Footer style={{ fontSize: ".8rem" }}>
          <hr style={{ margin: 0, padding: 0 }} />
          <Padding>
            <div style={{ position: "absolute", bottom: 0, left: 0 }}>
              PhantomCore uptime: <Timer onTick={() => getUptime()} />
            </div>
            <AppLinkButton
              id={SERVICE_MONITOR_REGISTRATION_ID}
              style={{ float: "right", verticalAlign: "bottom" }}
            />
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default ApplicationMonitorApp;
