import PhantomCore from "phantom-core";
import Layout, { Content, Footer } from "@components/Layout";
import AppRuntimeTable from "./AppRuntime.Table";
import Timer from "@components/Timer";

import useAppRuntimesContext from "@hooks/useAppRuntimesContext";

const ApplicationMonitor = {
  id: "application-monitor",
  title: "Application Monitor",
  style: {
    width: 640,
    height: 480,
  },
  isPinned: true,
  view: function View() {
    const { appRuntimes } = useAppRuntimesContext();

    // TODO: Determine if profiler is available in the current environment

    // TODO: Group by registration
    // TODO: Show attached services, per application
    // TODO: Show last render time / frequency / graph?
    // TODO: Implement ability to record render profile intervals, with the ability to show them in a graph (per application; use legend)
    // TODO: Implement ability to show how linked services affect render profiles; capture in recordings
    // TODO: Implement ability to do call stack tracing (only when recording)

    return (
      <Layout>
        <Content style={{ overflowY: "auto" }}>
          <AppRuntimeTable appRuntimes={appRuntimes} />
        </Content>
        <Footer style={{ fontSize: ".8rem" }}>
          Phantom Core uptime: <Timer onTick={() => PhantomCore.getUptime()} />
        </Footer>
      </Layout>
    );
  },
};

export default ApplicationMonitor;
