import Desktop from "@components/Desktop";

import AboutReshellWindow from "./windows/AboutReshellWindow";
import InputMediaDevicesWindow from "./windows/InputMediaDevicesWindow";
import TestVUMeterWindow from "./windows/TestVUMeterWindow";
import ScreenCaptureWindow from "./windows/ScreenCaptureWindow";
import ApplicationMonitor from "./windows/ApplicationMonitor";
import ServiceMonitor from "./windows/ServiceMonitor";
import PresentationExpress from "./windows/PresentationExpress";
import SpeakerAppWindow from "./windows/SpeakerAppWindow";
import ZenOSmosisWindow from "./windows/zenOSmosisWindow";
// import WindowAPIDiscovererWindow from "./windows/WindowAPIDiscovererWindow";

// import InputMediaDeviceSelectorView from "./views/InputMediaDeviceSelectorView";

export default function ExamplePortal() {
  return (
    <Desktop
      appDescriptors={[
        AboutReshellWindow,
        InputMediaDevicesWindow,
        TestVUMeterWindow,
        ScreenCaptureWindow,
        ApplicationMonitor,
        ServiceMonitor,
        PresentationExpress,
        SpeakerAppWindow,
        ZenOSmosisWindow,
        // WindowAPIDiscovererWindow,
      ]}
    />
  );
}
