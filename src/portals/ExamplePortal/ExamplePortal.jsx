import Desktop from "@components/Desktop";

import Applications from "./apps/Applications";
import AboutReshellWindow from "./apps/AboutReshellWindow";
import InputMediaDevicesWindow from "./apps/InputMediaDevicesWindow";
import TestVUMeterWindow from "./apps/TestVUMeterWindow";
import ScreenCapture from "./apps/ScreenCapture";
import ScreenShot from "./apps/ScreenShot";
import ApplicationMonitor from "./apps/ApplicationMonitor";
import ServiceMonitor from "./apps/ServiceMonitor";
import PresentationExpress from "./apps/PresentationExpress";
import SpeakerAppWindow from "./apps/SpeakerAppWindow";
import ZenOSmosisWindow from "./apps/zenOSmosisWindow";
import MenubarPrototype from "./apps/MenubarPrototype";
import Box3DPrototype from "./apps/Box3DPrototype";
import ColorAdjuster from "./apps/ColorAdjuster";
import NotesPrototype from "./apps/NotesPrototype";
import MemoryInfo from "./apps/MemoryInfo";
import HostBridge from "./apps/HostBridge";
import Files from "./apps/Files";
import Terminal from "./apps/Terminal";
import AppRegistrationMonitor from "./apps/AppRegistrationMonitor";
import Environment from "./apps/Environment";
// import WindowAPIDiscovererWindow from "./apps/WindowAPIDiscovererWindow";

// import InputMediaDeviceSelectorView from "./views/InputMediaDeviceSelectorView";

import PROTOVisualStudioCode from "./apps/ScreenCapture/PROTO.VisualStudioCode";
import PROTOWindows10 from "./apps/ScreenCapture/PROTO.Windows10";

export default function ExamplePortal() {
  return (
    <Desktop
      appDescriptors={[
        Applications,
        AboutReshellWindow,
        InputMediaDevicesWindow,
        TestVUMeterWindow,
        ScreenCapture,
        ScreenShot,
        ApplicationMonitor,
        ServiceMonitor,
        PresentationExpress,
        SpeakerAppWindow,
        ZenOSmosisWindow,
        MenubarPrototype,
        Box3DPrototype,
        ColorAdjuster,
        NotesPrototype,
        MemoryInfo,
        HostBridge,
        Files,
        Terminal,
        AppRegistrationMonitor,
        Environment,
        // WindowAPIDiscovererWindow,
        //
        PROTOVisualStudioCode,
        PROTOWindows10,
      ]}
    />
  );
}
