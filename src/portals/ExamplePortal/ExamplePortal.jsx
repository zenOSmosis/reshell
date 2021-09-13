import Desktop from "@components/Desktop";

import Applications from "./apps/Applications";
import AboutReshellWindow from "./apps/AboutReshellWindow";
import InputMediaDevicesWindow from "./apps/InputMediaDevicesWindow";
import TestVUMeterWindow from "./apps/TestVUMeterWindow";
import ScreenCaptureWindow from "./apps/ScreenCaptureWindow";
import ApplicationMonitor from "./apps/ApplicationMonitor";
import ServiceMonitor from "./apps/ServiceMonitor";
import PresentationExpress from "./apps/PresentationExpress";
import SpeakerAppWindow from "./apps/SpeakerAppWindow";
import ZenOSmosisWindow from "./apps/zenOSmosisWindow";
import MenubarProtoyper from "./apps/MenubarPrototype";
import Box3DPrototype from "./apps/Box3DPrototype";
import ColorAdjuster from "./apps/ColorAdjuster";
import NotesPrototype from "./apps/NotesPrototype";
import MemoryInfo from "./apps/MemoryInfo";
// import WindowAPIDiscovererWindow from "./apps/WindowAPIDiscovererWindow";

// import InputMediaDeviceSelectorView from "./views/InputMediaDeviceSelectorView";

export default function ExamplePortal() {
  return (
    <Desktop
      appDescriptors={[
        Applications,
        AboutReshellWindow,
        InputMediaDevicesWindow,
        TestVUMeterWindow,
        ScreenCaptureWindow,
        ApplicationMonitor,
        ServiceMonitor,
        PresentationExpress,
        SpeakerAppWindow,
        ZenOSmosisWindow,
        MenubarProtoyper,
        Box3DPrototype,
        ColorAdjuster,
        NotesPrototype,
        MemoryInfo,
        // WindowAPIDiscovererWindow,
      ]}
    />
  );
}
