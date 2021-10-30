import Desktop from "@components/Desktop";
import SpeakerAppLogoBackground from "./backgrounds/SpeakerAppLogoBackground";

import AboutReShell from "../ExamplePortal/apps/AboutReShell";
import BackgroundSelector from "../ExamplePortal/apps/BackgroundSelector";
import KeyVault from "../ExamplePortal/apps/KeyVault";
import InputMediaDevices from "../ExamplePortal/apps/InputMediaDevices";
import VUMeter from "../ExamplePortal/apps/VUMeter";
import ScreenCapture from "../ExamplePortal/apps/ScreenCapture";
import ScreenShot from "../ExamplePortal/apps/ScreenShot";
import ApplicationMonitor from "../ExamplePortal/apps/ApplicationMonitor";
import ServiceMonitor from "../ExamplePortal/apps/ServiceMonitor";
import ColorAdjuster from "../ExamplePortal/apps/ColorAdjuster";
import Environment from "../ExamplePortal/apps/Environment";
//
import Applications from "./apps/Applications";
import CallCentralStation from "./apps/CallCentralStation";
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
        BackgroundSelector,
        AboutReShell,
        KeyVault,
        InputMediaDevices,
        VUMeter,
        ScreenCapture,
        ScreenShot,
        ApplicationMonitor,
        ServiceMonitor,
        ColorAdjuster,
        LocalUserProfile,
        Environment,

        CallCentralStation,
        VirtualServer,

        // TODO: Remove
        NotificationsPrototype,
      ]}
    />
  );
}
