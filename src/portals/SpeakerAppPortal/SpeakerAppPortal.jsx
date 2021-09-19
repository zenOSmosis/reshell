import Desktop from "@components/Desktop";
import SpeakerAppLogoBackground from "./backgrounds/SpeakerAppLogoBackground";

// import BackgroundSelector from '../ExamplePortal/apps/BackgroundSelector'
import AboutReShell from "../ExamplePortal/apps/AboutReShell";
import LocalStorageVault from "../ExamplePortal/apps/LocalStorageVault";
import InputMediaDevicesWindow from "../ExamplePortal/apps/InputMediaDevicesWindow";
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

export default function SpeakerAppPortal() {
  return (
    <Desktop
      // TODO: Refactor
      backgroundView={<SpeakerAppLogoBackground />}
      appDescriptors={[
        Applications,
        // BackgroundSelector,
        AboutReShell,
        LocalStorageVault,
        InputMediaDevicesWindow,
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
      ]}
    />
  );
}
