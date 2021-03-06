import Desktop from "@components/Desktop";
import SpeakerAppLogoBackground from "./backgrounds/SpeakerAppLogoBackground";

import AboutReShellApp from "../ExamplePortal/apps/AboutReShellApp";
import BeepPrototypeApp from "../ExamplePortal/apps/BeepPrototypeApp";
import StartupManagerApp from "../ExamplePortal/apps/StartupManagerApp";
// import BackgroundSelectorApp from "../ExamplePortal/apps/BackgroundSelectorApp";
import KeyVaultApp from "../ExamplePortal/apps/KeyVaultApp";
import InputMediaDevicesApp from "../ExamplePortal/apps/InputMediaDevicesApp";
import VUMeterApp from "../ExamplePortal/apps/VUMeterApp";
import ScreenCaptureApp from "../ExamplePortal/apps/ScreenCaptureApp";
import ApplicationMonitorApp from "../ExamplePortal/apps/ApplicationMonitorApp";
import ServiceMonitorApp from "../ExamplePortal/apps/ServiceMonitorApp";
import ColorAdjusterApp from "../ExamplePortal/apps/ColorAdjusterApp";
import EnvironmentApp from "../ExamplePortal/apps/EnvironmentApp";
import CheckForUpdatesApp from "../ExamplePortal/apps/CheckForUpdatesApp";
import MemoryInfoApp from "../ExamplePortal/apps/MemoryInfoApp";
import SoftwareInfoApp from "../ExamplePortal/apps/SoftwareInfoApp";
import AppRegistrationViewerApp from "../ExamplePortal/apps/AppRegistrationViewerApp";
import NativeSpyAgentApp from "../ExamplePortal/apps/NativeSpyAgentApp";
import IPApp from "../ExamplePortal/apps/IPApp";
import TTSConfigurerApp from "../ExamplePortal/apps/TTSConfigurerApp";
//
import ApplicationsApp from "./apps/ApplicationsApp";
import CallPlayerApp from "./apps/CallPlayerApp";
import VirtualServerApp from "./apps/VirtualServerApp";
import LocalUserProfileApp from "./apps/LocalUserProfileApp";
import ChatApp from "./apps/ChatApp";

// Hackathon apps
import SpeechCommanderApp from "../HackathonPortal/apps/SpeechCommanderApp";
import DesktopCommanderDebuggerApp from "../ExamplePortal/apps/DesktopCommanderDebuggerApp";
import SayItDifferentApp from "../HackathonPortal/apps/SayItDifferentApp";
import DrReShellApp from "../HackathonPortal/apps/DrReShellApp";

import defaultAppAutoStartConfigs from "./defaultAppAutoStartConfigs";

export default function SpeakerAppPortal() {
  return (
    <Desktop
      backgroundView={<SpeakerAppLogoBackground />}
      appDescriptors={[
        ApplicationsApp,
        BeepPrototypeApp,
        StartupManagerApp,
        // BackgroundSelectorApp,
        AboutReShellApp,
        KeyVaultApp,
        InputMediaDevicesApp,
        VUMeterApp,
        ScreenCaptureApp,
        ApplicationMonitorApp,
        ServiceMonitorApp,
        ColorAdjusterApp,
        LocalUserProfileApp,
        EnvironmentApp,
        CheckForUpdatesApp,
        MemoryInfoApp,
        SoftwareInfoApp,
        AppRegistrationViewerApp,
        NativeSpyAgentApp,
        IPApp,
        TTSConfigurerApp,

        // Speaker.app-specific apps
        CallPlayerApp,
        VirtualServerApp,
        ChatApp,

        // Hackathon apps
        SpeechCommanderApp,
        DesktopCommanderDebuggerApp,
        SayItDifferentApp,
        DrReShellApp,
      ]}
      defaultAppAutoStartConfigs={defaultAppAutoStartConfigs}
    />
  );
}
