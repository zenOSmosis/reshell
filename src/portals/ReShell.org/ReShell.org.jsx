import Desktop from "@components/Desktop";

import ApplicationsApp from "./apps/ApplicationsApp";
import ApplicationMonitorApp from "../ExamplePortal/apps/ApplicationMonitorApp";
import AboutReShellApp from "./apps/AboutReShellApp";
import CheckForUpdatesApp from "../ExamplePortal/apps/CheckForUpdatesApp";
import ColorAdjusterApp from "../ExamplePortal/apps/ColorAdjusterApp";
import EnvironmentApp from "../ExamplePortal/apps/EnvironmentApp";
import ServiceMonitorApp from "../ExamplePortal/apps/ServiceMonitorApp";
import SoftwareInfoApp from "../ExamplePortal/apps/SoftwareInfoApp";
import InputMediaDevicesApp from "../ExamplePortal/apps/InputMediaDevicesApp";
import ScreenCaptureApp from "../ExamplePortal/apps/ScreenCaptureApp";
import VUMeterApp from "../ExamplePortal/apps/VUMeterApp";
import MemoryInfoApp from "../ExamplePortal/apps/MemoryInfoApp";
import KeyVaultApp from "../ExamplePortal/apps/KeyVaultApp";
import AppRegistrationViewerApp from "../ExamplePortal/apps/AppRegistrationViewerApp";

// Mesa Hackathon apps
import SpeechCommanderApp from "../HackathonPortal/apps/SpeechCommanderApp";
import DesktopCommanderDebuggerApp from "../ExamplePortal/apps/DesktopCommanderDebuggerApp";

export default function ReShellOrgPortal() {
  return (
    <Desktop
      appDescriptors={[
        ApplicationsApp,
        ApplicationMonitorApp,
        AboutReShellApp,
        CheckForUpdatesApp,
        ColorAdjusterApp,
        EnvironmentApp,
        InputMediaDevicesApp,
        MemoryInfoApp,
        ScreenCaptureApp,
        ServiceMonitorApp,
        SoftwareInfoApp,
        VUMeterApp,
        KeyVaultApp,
        AppRegistrationViewerApp,
        //
        SpeechCommanderApp,
        DesktopCommanderDebuggerApp,
      ]}
    />
  );
}
