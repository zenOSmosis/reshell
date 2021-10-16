import Desktop from "@components/Desktop";

import Applications from "./apps/Applications";
import AboutReShell from "./apps/AboutReShell";
import BackgroundSelector from "./apps/BackgroundSelector";
import BeepPrototype from "./apps/BeepPrototype";
import KeyVault from "./apps/KeyVault";
import InputMediaDevices from "./apps/InputMediaDevices";
import VUMeter from "./apps/VUMeter";
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
import NotificationsPrototype from "./apps/NotificationsPrototype";
import SystemInformation from "./apps/SystemInformation";
// import WindowAPIDiscovererWindow from "./apps/WindowAPIDiscovererWindow";

// import InputMediaDeviceSelectorView from "./views/InputMediaDeviceSelectorView";

export default function ExamplePortal() {
  return (
    <Desktop
      appDescriptors={[
        Applications,
        AboutReShell,
        BackgroundSelector,
        BeepPrototype,
        KeyVault,
        InputMediaDevices,
        VUMeter,
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
        NotificationsPrototype,
        SystemInformation,
        // WindowAPIDiscovererWindow,
        //
      ]}
    />
  );
}
