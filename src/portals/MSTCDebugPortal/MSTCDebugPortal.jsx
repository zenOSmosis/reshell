import Desktop from "@components/Desktop";

import AboutReShellApp from "../ExamplePortal/apps/AboutReShellApp";
import ApplicationsApp from "../ExamplePortal/apps/ApplicationsApp";
import BeepPrototypeApp from "../ExamplePortal/apps/BeepPrototypeApp";
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

import MSTCDebugApp from "./apps/MSTCDebugApp";

export default function MSTCDebugPortal() {
  return (
    <Desktop
      appDescriptors={[
        ApplicationsApp,
        BeepPrototypeApp,
        AboutReShellApp,
        KeyVaultApp,
        InputMediaDevicesApp,
        VUMeterApp,
        ScreenCaptureApp,
        ApplicationMonitorApp,
        ServiceMonitorApp,
        ColorAdjusterApp,
        EnvironmentApp,
        CheckForUpdatesApp,
        MemoryInfoApp,
        SoftwareInfoApp,
        //
        MSTCDebugApp,
      ]}
    />
  );
}
