import Padding from "@components/Padding";
import { Footer as LibFooter } from "@components/Layout";
import AppLinkButton from "@components/AppLinkButton";
import ButtonGroup from "@components/ButtonGroup";

import { REGISTRATION_ID as MESA_SPEECH_RECOGNITION_TEST_APP_REGISTRATION_ID } from "../../../MesaSpeechRecognitionDebuggerApp";
// import { REGISTRATION_ID as KEY_VAULT_REGISTRATION_ID } from "@portals/ExamplePortal/apps/KeyVaultApp";
import { REGISTRATION_ID as INPUT_MEDIA_DEVICES_REGISTRATION_ID } from "@portals/ExamplePortal/apps/InputMediaDevicesApp";
import { REGISTRATION_ID as COMMAND_DEBUGGER_REGISTRATION_ID } from "@portals/ExamplePortal/apps/DesktopCommanderDebuggerApp";

export default function Footer() {
  return (
    <LibFooter>
      <Padding style={{ textAlign: "center" }}>
        <ButtonGroup>
          <AppLinkButton id={INPUT_MEDIA_DEVICES_REGISTRATION_ID} />

          <AppLinkButton
            id={MESA_SPEECH_RECOGNITION_TEST_APP_REGISTRATION_ID}
            title="Speech Debugger"
          />

          <AppLinkButton
            id={COMMAND_DEBUGGER_REGISTRATION_ID}
            title="Command Debugger"
          />
        </ButtonGroup>
      </Padding>
    </LibFooter>
  );
}
