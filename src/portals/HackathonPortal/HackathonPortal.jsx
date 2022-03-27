import Desktop from "@components/Desktop";

// Borrowing from ReShell.org for their "auto-start policy" overrides
import ApplicationsApp from "../ReShell.org/apps/ApplicationsApp";
import AboutReShellApp from "../ReShell.org/apps/AboutReShellApp";

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
import PartOfSpeechAnalyzerApp from "./apps/PartOfSpeechAnalyzerApp";

export default function HackathonPortal() {
  return (
    <Desktop
      appDescriptors={[
        ApplicationsApp,
        AboutReShellApp,
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
        PartOfSpeechAnalyzerApp,
      ]}
    />
  );
}
