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
  view: function View() {
    const { appRuntimes } = useAppRuntimesContext();

    return <div>[Application Monitor] {appRuntimes.length}</div>;
  },
};

export default ApplicationMonitor;
