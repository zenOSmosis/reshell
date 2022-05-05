import Desktop from "@components/Desktop";

import StartupManagerApp from "./apps/StartupManagerApp";
import ApplicationsApp from "./apps/ApplicationsApp";
import AboutReShellApp from "./apps/AboutReShellApp";
import BackgroundSelectorApp from "./apps/BackgroundSelectorApp";
import BeepPrototypeApp from "./apps/BeepPrototypeApp";
import CheckForUpdatesApp from "./apps/CheckForUpdatesApp";
import KeyVaultApp from "./apps/KeyVaultApp";
import InputMediaDevicesApp from "./apps/InputMediaDevicesApp";
import VUMeterApp from "./apps/VUMeterApp";
import ScreenCaptureApp from "./apps/ScreenCaptureApp";
import ApplicationMonitorApp from "./apps/ApplicationMonitorApp";
import ServiceMonitorApp from "./apps/ServiceMonitorApp";
import PresentationExpressApp from "./apps/PresentationExpressApp";
import MenuBarPrototypeApp from "./apps/MenuBarPrototypeApp";
import Box3DPrototypeApp from "./apps/Box3DPrototypeApp";
import ColorAdjusterApp from "./apps/ColorAdjusterApp";
import NotesPrototypeApp from "./apps/NotesPrototypeApp";
import MemoryInfoApp from "./apps/MemoryInfoApp";
import HostBridgeApp from "./apps/HostBridgeApp";
import FilesApp from "./apps/FilesApp";
import TerminalApp from "./apps/TerminalApp";
import AppRegistrationViewerApp from "./apps/AppRegistrationViewerApp";
import EnvironmentApp from "./apps/EnvironmentApp";
import NotificationsPrototypeApp from "./apps/NotificationsPrototypeApp";
import ModalsPrototypeApp from "./apps/ModalsPrototypeApp";
import SystemInformationApp from "./apps/SystemInformationApp";
import DesktopCommanderDebuggerApp from "./apps/DesktopCommanderDebuggerApp";
import NativeSpyAgentApp from "./apps/NativeSpyAgentApp";
import HelloWorldApp from "./apps/HelloWorldApp";
import DrReShellApp from "./apps/DrReShellApp";

import defaultAppAutoStartConfigs from "./defaultAppAutoStartConfigs";

export default function ExamplePortal() {
  return (
    <Desktop
      appDescriptors={[
        StartupManagerApp,
        ApplicationsApp,
        AboutReShellApp,
        BackgroundSelectorApp,
        BeepPrototypeApp,
        CheckForUpdatesApp,
        KeyVaultApp,
        InputMediaDevicesApp,
        VUMeterApp,
        ScreenCaptureApp,
        ApplicationMonitorApp,
        ServiceMonitorApp,
        PresentationExpressApp,
        MenuBarPrototypeApp,
        Box3DPrototypeApp,
        ColorAdjusterApp,
        NotesPrototypeApp,
        MemoryInfoApp,
        HostBridgeApp,
        FilesApp,
        TerminalApp,
        AppRegistrationViewerApp,
        EnvironmentApp,
        NotificationsPrototypeApp,
        ModalsPrototypeApp,
        SystemInformationApp,
        DesktopCommanderDebuggerApp,
        NativeSpyAgentApp,
        HelloWorldApp,
        DrReShellApp,
      ]}
      defaultAppAutoStartConfigs={defaultAppAutoStartConfigs}
    />
  );
}
