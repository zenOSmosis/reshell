import Desktop from "@components/Desktop";
import SpeakerAppLogoBackground from "./backgrounds/SpeakerAppLogoBackground";

import AboutReShellApp from "../ExamplePortal/apps/AboutReShellApp";
import BeepPrototypeApp from "../ExamplePortal/apps/BeepPrototypeApp";
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
//
import ApplicationsApp from "./apps/ApplicationsApp";
import CallPlayerApp from "./apps/CallPlayerApp";
import VirtualServerApp from "./apps/VirtualServerApp";
import LocalUserProfileApp from "./apps/LocalUserProfileApp";
import ChatApp from "./apps/ChatApp";

// TODO: Remove
import NotificationsPrototypeApp from "../ExamplePortal/apps/NotificationsPrototypeApp";

export default function SpeakerAppPortal() {
  return (
    <Desktop
      // TODO: Refactor
      backgroundView={<SpeakerAppLogoBackground />}
      appDescriptors={[
        ApplicationsApp,
        BeepPrototypeApp,
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

        CallPlayerApp,
        VirtualServerApp,
        ChatApp,

        // TODO: Remove
        NotificationsPrototypeApp,
      ]}
    />
  );
}
