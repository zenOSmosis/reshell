import Desktop from "@components/Desktop";

import Applications from "../ExamplePortal/apps/Applications";
import AboutReShell from "../ExamplePortal/apps/AboutReShell";
import InputMediaDevicesWindow from "../ExamplePortal/apps/InputMediaDevicesWindow";
import TestVUMeterWindow from "../ExamplePortal/apps/TestVUMeterWindow";
import ScreenCapture from "../ExamplePortal/apps/ScreenCapture";
import ScreenShot from "../ExamplePortal/apps/ScreenShot";
import ApplicationMonitor from "../ExamplePortal/apps/ApplicationMonitor";
import ServiceMonitor from "../ExamplePortal/apps/ServiceMonitor";
import ColorAdjuster from "../ExamplePortal/apps/ColorAdjuster";

export default function ExamplePortal() {
  return (
    <Desktop
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
      ]}
    />
  );
}
