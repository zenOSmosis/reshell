import Desktop from "@components/Desktop";

import Applications from "./apps/Applications";
import ApplicationMonitor from "../ExamplePortal/apps/ApplicationMonitor";
import AboutReShell from "./apps/AboutReShell";
import CheckForUpdates from "../ExamplePortal/apps/CheckForUpdates";
import ColorAdjuster from "../ExamplePortal/apps/ColorAdjuster";
import ServiceMonitor from "../ExamplePortal/apps/ServiceMonitor";
import SoftwareInfo from "../ExamplePortal/apps/SoftwareInfo";
import InputMediaDevices from "../ExamplePortal/apps/InputMediaDevices";
import ScreenCapture from "../ExamplePortal/apps/ScreenCapture";
import VUMeter from "../ExamplePortal/apps/VUMeter";
import MemoryInfo from "../ExamplePortal/apps/MemoryInfo/MemoryInfo";

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
        ColorAdjuster,
        InputMediaDevices,
        MemoryInfo,
        ScreenCapture,
        ServiceMonitor,
        SoftwareInfo,
        VUMeter,
      ]}
    />
  );
}
