import Desktop from "@components/Desktop";

import Applications from "../ExamplePortal/apps/Applications";
import AboutReShell from "../ExamplePortal/apps/AboutReShell";
import ServiceMonitor from "../ExamplePortal/apps/ServiceMonitor";

// import WindowAPIDiscovererWindow from "./apps/WindowAPIDiscovererWindow";

// import InputMediaDeviceSelectorView from "./views/InputMediaDeviceSelectorView";

export default function ReShellOrgPortal() {
  return (
    <Desktop appDescriptors={[Applications, AboutReShell, ServiceMonitor]} />
  );
}
