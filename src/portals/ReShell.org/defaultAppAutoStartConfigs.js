import { REGISTRATION_ID as ABOUT_RESHELL_REGISTRATION_ID } from "../ExamplePortal/apps/AboutReShellApp";
import { REGISTRATION_ID as SPEECH_COMMANDER_REGISTRATION_ID } from "../HackathonPortal/apps/SpeechCommanderApp";

const defaultAppAutoStartConfigs = {
  [SPEECH_COMMANDER_REGISTRATION_ID]: {
    priority: 0,
  },
  [ABOUT_RESHELL_REGISTRATION_ID]: {
    priority: 5,
  },
};

export default defaultAppAutoStartConfigs;
