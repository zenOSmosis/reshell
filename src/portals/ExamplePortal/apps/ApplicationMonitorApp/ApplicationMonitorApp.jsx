import PhantomCore from "phantom-core";

import Padding from "@components/Padding";
import Layout, { Content, Footer } from "@components/Layout";
import AppRuntimeTable from "./AppRuntime.Table";
import Timer from "@components/Timer";

import useAppOrchestrationContext from "@hooks/useAppOrchestrationContext";

const ApplicationMonitorApp = {
  id: "application-monitor",
  title: "Application Monitor",
  style: {
    width: 640,
    height: 480,
  },
  isPinned: true,
  view: function View() {
    const { appRuntimes } = useAppOrchestrationContext();

    // TODO: Determine if profiler is available in the current environment

    // TODO: Group by registration
    // TODO: Show attached services, per application
    // TODO: Show last render time / frequency / graph?
    // TODO: Implement ability to record render profile intervals, with the ability to show them in a graph (per application; use legend)
    // TODO: Implement ability to show how linked services affect render profiles; capture in recordings
    // TODO: Implement ability to do call stack tracing (only when recording)

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