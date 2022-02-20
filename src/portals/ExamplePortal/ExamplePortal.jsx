import Desktop from "@components/Desktop";

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
import AppRegistrationMonitorApp from "./apps/AppRegistrationMonitorApp";
import EnvironmentApp from "./apps/EnvironmentApp";
import NotificationsPrototypeApp from "./apps/NotificationsPrototypeApp";
import ModalsPrototypeApp from "./apps/ModalsPrototypeApp";
import SystemInformationApp from "./apps/SystemInformationApp";

// import InputMediaDevicesSelectorView from "./views/InputMediaDevicesSelectorView";

export default function ExamplePortal() {
  return (
    <Desktop
      appDescriptors={[
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
        AppRegistrationMonitorApp,
        EnvironmentApp,
        NotificationsPrototypeApp,
        ModalsPrototypeApp,
        SystemInformationApp,
      ]}
    />
  );
}
