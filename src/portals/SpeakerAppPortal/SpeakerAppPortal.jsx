import Desktop from "@components/Desktop";
import Full from "@components/Full";
import Center from "@components/Center";
import AutoScaler from "@components/AutoScaler";

import Applications from "../ExamplePortal/apps/Applications";
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
import CallCentral from "./apps/CallCentral";
import VirtualServer from "./apps/VirtualServer";

export default function SpeakerAppPortal() {
  return (
    <Desktop
      // TODO: Refactor
      backgroundView={
        <Full style={{ backgroundColor: "#999" }}>
          <AutoScaler>
            <div style={{ padding: 20 }}>[Speaker.app]</div>
          </AutoScaler>
        </Full>
      }
      appDescriptors={[
        Applications,
        AboutReShell,
        InputMediaDevicesWindow,
        TestVUMeterWindow,
        ScreenCapture,
        ScreenShot,
        ApplicationMonitor,
        ServiceMonitor,
        ColorAdjuster,
        // LocalStorageVaultPrototype,

        CallCentral,
        VirtualServer,
      ]}
    />
  );
}
