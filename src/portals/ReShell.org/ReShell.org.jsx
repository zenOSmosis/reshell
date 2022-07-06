import { useEffect } from "react";

const REDIRECT_URL = "https://speaker.app";

export default function TempRedirect() {
  useEffect(() => {
    window.location = REDIRECT_URL;
  }, []);

  return (
    <div>
      Content has temporarily moved to:{" "}
      <a href={REDIRECT_URL}>{REDIRECT_URL}</a>.
    </div>
  );
}

/*
import Desktop from "@components/Desktop";

import ApplicationsApp from "../ExamplePortal/apps/ApplicationsApp";
import ApplicationMonitorApp from "../ExamplePortal/apps/ApplicationMonitorApp";
import StartupManagerApp from "../ExamplePortal/apps/StartupManagerApp";
import AboutReShellApp from "../ExamplePortal/apps/AboutReShellApp";
import CheckForUpdatesApp from "../ExamplePortal/apps/CheckForUpdatesApp";
import ColorAdjusterApp from "../ExamplePortal/apps/ColorAdjusterApp";
import EnvironmentApp from "../ExamplePortal/apps/EnvironmentApp";
import ServiceMonitorApp from "../ExamplePortal/apps/ServiceMonitorApp";
import SoftwareInfoApp from "../ExamplePortal/apps/SoftwareInfoApp";
import InputMediaDevicesApp from "../ExamplePortal/apps/InputMediaDevicesApp";
import ScreenCaptureApp from "../ExamplePortal/apps/ScreenCaptureApp";
import VUMeterApp from "../ExamplePortal/apps/VUMeterApp";
import MemoryInfoApp from "../ExamplePortal/apps/MemoryInfoApp";
import KeyVaultApp from "../ExamplePortal/apps/KeyVaultApp";
import AppRegistrationViewerApp from "../ExamplePortal/apps/AppRegistrationViewerApp";
import NativeSpyAgentApp from "../ExamplePortal/apps/NativeSpyAgentApp";
import IPApp from "../ExamplePortal/apps/IPApp";
import TTSConfigurerApp from "../ExamplePortal/apps/TTSConfigurerApp";
import UptimeApp from "../ExamplePortal/apps/UptimeApp";

// Hackathon apps
import SpeechCommanderApp from "../HackathonPortal/apps/SpeechCommanderApp";
import DesktopCommanderDebuggerApp from "../ExamplePortal/apps/DesktopCommanderDebuggerApp";
import SayItDifferentApp from "../HackathonPortal/apps/SayItDifferentApp";
import DrReShellApp from "../HackathonPortal/apps/DrReShellApp";

import defaultAppAutoStartConfigs from "./defaultAppAutoStartConfigs";
*/

/*
export default function ReShellOrgPortal() {
  return (
    <Desktop
      appDescriptors={[
        ApplicationsApp,
        ApplicationMonitorApp,
        StartupManagerApp,
        AboutReShellApp,
        CheckForUpdatesApp,
        ColorAdjusterApp,
        EnvironmentApp,
        InputMediaDevicesApp,
        MemoryInfoApp,
        ScreenCaptureApp,
        ServiceMonitorApp,
        SoftwareInfoApp,
        VUMeterApp,
        KeyVaultApp,
        AppRegistrationViewerApp,
        NativeSpyAgentApp,
        SayItDifferentApp,
        IPApp,
        TTSConfigurerApp,
        UptimeApp,
        //
        SpeechCommanderApp,
        DesktopCommanderDebuggerApp,
        DrReShellApp,
      ]}
      defaultAppAutoStartConfigs={defaultAppAutoStartConfigs}
    />
  );
}
*/
