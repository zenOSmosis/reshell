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
import MenubarProtoyper from "./windows/MenubarPrototype";
import Box3DPrototype from "./windows/Box3DPrototype";
import ColorAdjuster from "./windows/ColorAdjuster";
import NotesPrototype from "./windows/NotesPrototype";
import MemoryInfo from "./windows/MemoryInfo";
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
