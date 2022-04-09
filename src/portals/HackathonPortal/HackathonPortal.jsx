import Desktop from "@components/Desktop";

import ApplicationsApp from "../ExamplePortal/apps/ApplicationsApp";
import AboutReShellApp from "../ExamplePortal/apps/AboutReShellApp";
import StartupManagerApp from "../ExamplePortal/apps/StartupManagerApp";

// import BackgroundSelectorApp from "../ExamplePortal/apps/BackgroundSelectorApp";
// import BeepPrototypeApp from "../ExamplePortal/apps/BeepPrototypeApp";
import CheckForUpdatesApp from "../ExamplePortal/apps/CheckForUpdatesApp";
import KeyVaultApp from "../ExamplePortal/apps/KeyVaultApp";
import InputMediaDevicesApp from "../ExamplePortal/apps/InputMediaDevicesApp";
import VUMeterApp from "../ExamplePortal/apps/VUMeterApp";
import ScreenCaptureApp from "../ExamplePortal/apps/ScreenCaptureApp";
import ApplicationMonitorApp from "../ExamplePortal/apps/ApplicationMonitorApp";
import ServiceMonitorApp from "../ExamplePortal/apps/ServiceMonitorApp";
// import Box3DPrototypeApp from "../ExamplePortal/apps/Box3DPrototypeApp";
import ColorAdjusterApp from "../ExamplePortal/apps/ColorAdjusterApp";
// import NotesPrototypeApp from "../ExamplePortal/apps/NotesPrototypeApp";
import MemoryInfoApp from "../ExamplePortal/apps/MemoryInfoApp";
import AppRegistrationViewerApp from "../ExamplePortal/apps/AppRegistrationViewerApp";
import EnvironmentApp from "../ExamplePortal/apps/EnvironmentApp";

import SpeechCommanderApp from "./apps/SpeechCommanderApp";
import DesktopCommanderDebuggerApp from "../ExamplePortal/apps/DesktopCommanderDebuggerApp";
import SayItDifferentApp from "./apps/SayItDifferentApp";
import NativeSpyAgentApp from "../ExamplePortal/apps/NativeSpyAgentApp";

import defaultAppAutoStartConfigs from "./defaultAppAutoStartConfigs";

export default function HackathonPortal() {
  return (
    <Desktop
      appDescriptors={[
        ApplicationsApp,
        AboutReShellApp,
        StartupManagerApp,
        // BackgroundSelectorApp,
        // BeepPrototypeApp,
        CheckForUpdatesApp,
        KeyVaultApp,
        InputMediaDevicesApp,
        VUMeterApp,
        ScreenCaptureApp,
        ApplicationMonitorApp,
        ServiceMonitorApp,
        // Box3DPrototypeApp,
        ColorAdjusterApp,
        // NotesPrototypeApp,
        MemoryInfoApp,
        AppRegistrationViewerApp,
        EnvironmentApp,
        //
        SpeechCommanderApp,
        DesktopCommanderDebuggerApp,
        SayItDifferentApp,
        NativeSpyAgentApp,
      ]}
      defaultAppAutoStartConfigs={defaultAppAutoStartConfigs}
    />
  );
}
