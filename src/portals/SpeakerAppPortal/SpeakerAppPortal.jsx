import Desktop from "@components/Desktop";
import SpeakerAppLogoBackground from "./backgrounds/SpeakerAppLogoBackground";

import AboutReShell from "../ExamplePortal/apps/AboutReShell";
import BeepPrototype from "../ExamplePortal/apps/BeepPrototype";
// import BackgroundSelector from "../ExamplePortal/apps/BackgroundSelector";
import KeyVault from "../ExamplePortal/apps/KeyVault";
import InputMediaDevices from "../ExamplePortal/apps/InputMediaDevices";
import VUMeter from "../ExamplePortal/apps/VUMeter";
import ScreenCapture from "../ExamplePortal/apps/ScreenCapture";
// import ScreenShot from "../ExamplePortal/apps/ScreenShot";
import ApplicationMonitor from "../ExamplePortal/apps/ApplicationMonitor";
import ServiceMonitor from "../ExamplePortal/apps/ServiceMonitor";
import ColorAdjuster from "../ExamplePortal/apps/ColorAdjuster";
import Environment from "../ExamplePortal/apps/Environment";
import CheckForUpdates from "../ExamplePortal/apps/CheckForUpdates/CheckForUpdates";
import MemoryInfo from "../ExamplePortal/apps/MemoryInfo";
import SoftwareInfo from "../ExamplePortal/apps/SoftwareInfo";
//
import Applications from "./apps/Applications";
import CallPlayer from "./apps/CallPlayer";
import VirtualServer from "./apps/VirtualServer";
import LocalUserProfile from "./apps/LocalUserProfile";

// TODO: Remove
import NotificationsPrototype from "../ExamplePortal/apps/NotificationsPrototype";

export default function SpeakerAppPortal() {
  return (
    <Desktop
      // TODO: Refactor
      backgroundView={<SpeakerAppLogoBackground />}
      appDescriptors={[
        Applications,
        BeepPrototype,
        // BackgroundSelector,
        AboutReShell,
        KeyVault,
        InputMediaDevices,
        VUMeter,
        ScreenCapture,
        // ScreenShot,
        ApplicationMonitor,
        ServiceMonitor,
        ColorAdjuster,
        LocalUserProfile,
        Environment,
        CheckForUpdates,
        MemoryInfo,
        SoftwareInfo,

        CallPlayer,
        VirtualServer,

        // TODO: Remove
        NotificationsPrototype,
      ]}
    />
  );
}
