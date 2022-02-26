import Desktop from "@components/Desktop";

import ApplicationsApp from "../ExamplePortal/apps/ApplicationsApp";
import AboutReShellApp from "../ExamplePortal/apps/AboutReShellApp";
import BackgroundSelectorApp from "../ExamplePortal/apps/BackgroundSelectorApp";
import BeepPrototypeApp from "../ExamplePortal/apps/BeepPrototypeApp";
import CheckForUpdatesApp from "../ExamplePortal/apps/CheckForUpdatesApp";
import KeyVaultApp from "../ExamplePortal/apps/KeyVaultApp";
import InputMediaDevicesApp from "../ExamplePortal/apps/InputMediaDevicesApp";
import VUMeterApp from "../ExamplePortal/apps/VUMeterApp";
import ScreenCaptureApp from "../ExamplePortal/apps/ScreenCaptureApp";
import ApplicationMonitorApp from "../ExamplePortal/apps/ApplicationMonitorApp";
import ServiceMonitorApp from "../ExamplePortal/apps/ServiceMonitorApp";
import PresentationExpressApp from "../ExamplePortal/apps/PresentationExpressApp";
import Box3DPrototypeApp from "../ExamplePortal/apps/Box3DPrototypeApp";
import ColorAdjusterApp from "../ExamplePortal/apps/ColorAdjusterApp";
import NotesPrototypeApp from "../ExamplePortal/apps/NotesPrototypeApp";
import MemoryInfoApp from "../ExamplePortal/apps/MemoryInfoApp";
import AppRegistrationMonitorApp from "../ExamplePortal/apps/AppRegistrationMonitorApp";
import EnvironmentApp from "../ExamplePortal/apps/EnvironmentApp";

export default function MSAzureHackathonPortal() {
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
        Box3DPrototypeApp,
        ColorAdjusterApp,
        NotesPrototypeApp,
        MemoryInfoApp,
        AppRegistrationMonitorApp,
        EnvironmentApp,
      ]}
    />
  );
}
