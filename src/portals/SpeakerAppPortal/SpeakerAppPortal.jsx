import Desktop from "@components/Desktop";
import SpeakerAppLogoBackground from "./backgrounds/SpeakerAppLogoBackground";

import Applications from "../ExamplePortal/apps/Applications";
// import BackgroundSelector from '../ExamplePortal/apps/BackgroundSelector'
import AboutReShell from "../ExamplePortal/apps/AboutReShell";
import InputMediaDevicesWindow from "../ExamplePortal/apps/InputMediaDevicesWindow";
import TestVUMeterWindow from "../ExamplePortal/apps/TestVUMeterWindow";
import ScreenCapture from "../ExamplePortal/apps/ScreenCapture";
import ScreenShot from "../ExamplePortal/apps/ScreenShot";
import ApplicationMonitor from "../ExamplePortal/apps/ApplicationMonitor";
import ServiceMonitor from "../ExamplePortal/apps/ServiceMonitor";
import ColorAdjuster from "../ExamplePortal/apps/ColorAdjuster";
// import LocalStorageVaultPrototype from "../ExamplePortal/apps/LocalStorageVaultPrototype";
//
import CallCentralStation from "./apps/CallCentralStation";
import VirtualServer from "./apps/VirtualServer";

export default function SpeakerAppPortal() {
  return (
    <Desktop
      // TODO: Refactor
      backgroundView={<SpeakerAppLogoBackground />}
      appDescriptors={[
        Applications,
        // BackgroundSelector,
        AboutReShell,
        InputMediaDevicesWindow,
        TestVUMeterWindow,
        ScreenCapture,
        ScreenShot,
        ApplicationMonitor,
        ServiceMonitor,
        ColorAdjuster,
        // LocalStorageVaultPrototype,

        CallCentralStation,
        VirtualServer,
      ]}
    />
  );
}
