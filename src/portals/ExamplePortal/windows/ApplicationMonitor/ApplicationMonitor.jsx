import PhantomCore from "phantom-core";
import Layout, { Content, Footer } from "@components/Layout";
import AppRuntimeTable from "./AppRuntime.Table";
import Timer from "@components/Timer";

import useAppRuntimesContext from "@hooks/useAppRuntimesContext";

const ApplicationMonitor = {
  id: "application-monitor",
  title: "Application Monitor",
  style: {
    left: "auto",
    bottom: 0,
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
    // TODO: Highlight active window application
    // TODO: Implement ability to bring application to front

    // TODO: Implement ability to do call stack tracing

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
