import Desktop from "@components/Desktop";

import Applications from "../ExamplePortal/apps/Applications";
import AboutReshellWindow from "../ExamplePortal/apps/AboutReshellWindow";
import InputMediaDevicesWindow from "../ExamplePortal/apps/InputMediaDevicesWindow";
import TestVUMeterWindow from "../ExamplePortal/apps/TestVUMeterWindow";
import ScreenCaptureWindow from "../ExamplePortal/apps/ScreenCaptureWindow";
// import ScreenShot from "../ExamplePortal/apps/ScreenShot";
import ApplicationMonitor from "../ExamplePortal/apps/ApplicationMonitor";
import ServiceMonitor from "../ExamplePortal/apps/ServiceMonitor";
import ColorAdjuster from "../ExamplePortal/apps/ColorAdjuster";

export default function ExamplePortal() {
  return (
    <Desktop
      appDescriptors={[
        Applications,
        AboutReshellWindow,
        InputMediaDevicesWindow,
        TestVUMeterWindow,
        ScreenCaptureWindow,
        // ScreenShot,
        ApplicationMonitor,
        ServiceMonitor,
        ColorAdjuster,
      ]}
    />
  );
}
