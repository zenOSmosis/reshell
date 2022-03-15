/*
import Padding from "@components/Padding";
import Layout, {
  Header,
  Content,
  Footer,
  Row,
  Column,
} from "@components/Layout";
*/
import Center from "@components/Center";
// import AppLinkButton from "@components/AppLinkButton";
// import LabeledLED from "@components/labeled/LabeledLED/LabeledLED";
// import ButtonGroup from "@components/ButtonGroup";

// import { REGISTRATION_ID as INPUT_MEDIA_DEVICES_REGISTRATION_ID } from "@portals/ExamplePortal/apps/InputMediaDevicesApp";
// import { REGISTRATION_ID as KEY_VAULT_REGISTRATION_ID } from "@portals/ExamplePortal/apps/KeyVaultApp";
// import { REGISTRATION_ID as COMMAND_DEBUGGER_REGISTRATION_ID } from "@portals/ExamplePortal/apps/DesktopCommanderDebuggerApp";

import PartOfSpeechAnalyzerService from "@services/PartOfSpeechAnalyzerService";

export const REGISTRATION_ID = "part-of-speech-analyzer";

const PartOfSpeechAnalyzerApp = {
  id: REGISTRATION_ID,
  title: "Part of Speech Analyzer",
  style: {
    width: 320,
    height: 320,
  },
  serviceClasses: [PartOfSpeechAnalyzerService],
  /*
  titleBarView: function TitleBarView({ sharedState, setSharedState }) {
  },
  */
  view: function View({ appServices }) {
    // TODO: Implement input selection from keyboard, to audio
    // TODO: Tie into https://www.npmjs.com/package/compromise

    return <Center>Part of Speech Analyzer</Center>;
  },
};

export default PartOfSpeechAnalyzerApp;
