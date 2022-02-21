import PhantomCore from "phantom-core";

import { useEffect } from "react";

import AppRuntimeTable from "./AppRuntime.Table";

import Center from "@components/Center";
import Padding from "@components/Padding";
import Layout, { Content, Footer } from "@components/Layout";
import Timer from "@components/Timer";

import useDesktopContext from "@hooks/useDesktopContext";
import useAppOrchestrationContext from "@hooks/useAppOrchestrationContext";

const ApplicationMonitorApp = {
  id: "application-monitor",
  title: "Application Monitor",
  style: {
    width: 640,
    height: 480,
  },
  isPinned: true,
  view: function View({ windowController }) {
    const { appRuntimes } = useAppOrchestrationContext();
    const { isProfiling, setIsProfiling } = useDesktopContext();

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
            IMPORTANT: Each window may lose its current state once profiling is
            enabled. Also, once enabled and closing this application, the state
            may be lost again!
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
          <Padding>
            PhantomCore uptime: <Timer onTick={() => PhantomCore.getUptime()} />
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default ApplicationMonitorApp;
