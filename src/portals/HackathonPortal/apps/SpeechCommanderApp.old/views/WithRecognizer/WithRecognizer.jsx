import Padding from "@components/Padding";
import Layout, { Header, Content } from "@components/Layout";
import LabeledToggle from "@components/labeled/LabeledToggle";
import Center from "@components/Center";
import AppLinkButton from "@components/AppLinkButton";

import MesaFooter from "../../components/Footer";

import { REGISTRATION_ID as COMMAND_DEBUGGER_REGISTRATION_ID } from "@portals/ExamplePortal/apps/DesktopCommanderDebuggerApp";

// TODO: Document
// TODO: Add prop-types
export default function WithRecognizer({
  desktopControllerService,
  transcriptionToRender,
  lastCommand,
  isDesktopControlEnabled,
  onDesktopControlEnabledChange,
}) {
  return (
    <Layout>
      <Header>
        <Padding style={{ textAlign: "center" }}>
          <div>
            <p>
              Enable Desktop Speech Control to control ReShell with your speech.
            </p>
            <LabeledToggle
              isOn={isDesktopControlEnabled}
              onChange={onDesktopControlEnabledChange}
              masterLabel="Desktop Speech Control"
            />
            <div style={{ marginLeft: 20, display: "inline-block" }}>
              <AppLinkButton
                id={COMMAND_DEBUGGER_REGISTRATION_ID}
                style={{
                  // TODO: Use color variable for highlighted elements
                  backgroundColor: "#347fe8",
                }}
                title="View Example Phrases"
              ></AppLinkButton>
            </div>
          </div>
        </Padding>
      </Header>
      <Content>
        <Padding>
          <Center>
            {transcriptionToRender && (
              <span style={{ fontWeight: "bold" }}>
                {transcriptionToRender}
              </span>
            )}
            {lastCommand && (
              <div style={{ color: "green", marginTop: 10 }} className="note">
                Last command: {lastCommand.description}
              </div>
            )}
          </Center>
        </Padding>
      </Content>
      <MesaFooter />
    </Layout>
  );
}
