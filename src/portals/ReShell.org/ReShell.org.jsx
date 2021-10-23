import Desktop from "@components/Desktop";

import Applications from "./apps/Applications";
import ApplicationMonitor from "../ExamplePortal/apps/ApplicationMonitor";
import AboutReShell from "./apps/AboutReShell";
import CheckForUpdates from "../ExamplePortal/apps/CheckForUpdates";
import ServiceMonitor from "../ExamplePortal/apps/ServiceMonitor";
import SoftwareInfo from "../ExamplePortal/apps/SoftwareInfo";

// import WindowAPIDiscovererWindow from "./apps/WindowAPIDiscovererWindow";

// import InputMediaDeviceSelectorView from "./views/InputMediaDeviceSelectorView";

export default function ReShellOrgPortal() {
  return (
    <Desktop
      appDescriptors={[
        Applications,
        ApplicationMonitor,
        AboutReShell,
        CheckForUpdates,
        ServiceMonitor,
        SoftwareInfo,
      ]}
    />
  );
}
