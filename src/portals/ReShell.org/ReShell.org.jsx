import Desktop from "@components/Desktop";

import ApplicationsApp from "../ExamplePortal/apps/ApplicationsApp";
import ApplicationMonitorApp from "../ExamplePortal/apps/ApplicationMonitorApp";
import StartupManagerApp from "../ExamplePortal/apps/StartupManagerApp";
import AboutReShellApp from "../ExamplePortal/apps/AboutReShellApp";
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
import NativeSpyAgentApp from "../ExamplePortal/apps/NativeSpyAgentApp";

// Hackathon apps
import SpeechCommanderApp from "../HackathonPortal/apps/SpeechCommanderApp";
import DesktopCommanderDebuggerApp from "../ExamplePortal/apps/DesktopCommanderDebuggerApp";

import defaultAppAutoStartConfigs from "./defaultAppAutoStartConfigs";

export default function ReShellOrgPortal() {
  return (
    <Desktop
      appDescriptors={[
        ApplicationsApp,
        ApplicationMonitorApp,
        StartupManagerApp,
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
        NativeSpyAgentApp,
        //
        SpeechCommanderApp,
        DesktopCommanderDebuggerApp,
      ]}
      defaultAppAutoStartConfigs={defaultAppAutoStartConfigs}
    />
  );
}
