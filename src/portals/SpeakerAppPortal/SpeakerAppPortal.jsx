import SocketProvider from "./providers/SocketProvider";

import Desktop from "@components/Desktop";
import SpeakerAppLogoBackground from "./backgrounds/SpeakerAppLogoBackground";

import AboutReShell from "../ExamplePortal/apps/AboutReShell";
import BackgroundSelector from "../ExamplePortal/apps/BackgroundSelector";
import LocalStorageVault from "../ExamplePortal/apps/LocalStorageVault";
import InputMediaDevices from "../ExamplePortal/apps/InputMediaDevices";
import TestVUMeterWindow from "../ExamplePortal/apps/TestVUMeterWindow";
import ScreenCapture from "../ExamplePortal/apps/ScreenCapture";
import ScreenShot from "../ExamplePortal/apps/ScreenShot";
import ApplicationMonitor from "../ExamplePortal/apps/ApplicationMonitor";
import ServiceMonitor from "../ExamplePortal/apps/ServiceMonitor";
import ColorAdjuster from "../ExamplePortal/apps/ColorAdjuster";
// import LocalStorageVaultPrototype from "../ExamplePortal/apps/LocalStorageVaultPrototype";
//
import Applications from "./apps/Applications";
import CallCentralStation from "./apps/CallCentralStation";
import VirtualServer from "./apps/VirtualServer";
import LocalUserProfile from "./apps/LocalUserProfile";

// TODO: Remove
import NotificationsPrototype from "../ExamplePortal/apps/NotificationsPrototype";

export default function SpeakerAppPortal() {
  return (
    // TODO: Wrap Desktop w/ Speaker.app UI providers (and eventually refactor to use Service-provided Providers?)
    <SocketProvider>
      <Desktop
        // TODO: Refactor
        backgroundView={<SpeakerAppLogoBackground />}
        appDescriptors={[
          Applications,
          BackgroundSelector,
          AboutReShell,
          LocalStorageVault,
          InputMediaDevices,
          TestVUMeterWindow,
          ScreenCapture,
          ScreenShot,
          ApplicationMonitor,
          ServiceMonitor,
          ColorAdjuster,
          LocalUserProfile,
          // LocalStorageVaultPrototype,

          CallCentralStation,
          VirtualServer,

          // TODO: Remove
          NotificationsPrototype,
        ]}
      />
    </SocketProvider>
  );
}
