import { useCallback, useEffect, useState } from "react";
import Center from "@components/Center";
import Layout, { Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";

import DesktopCommanderControllerService from "@services/DesktopCommanderControllerService";
import AppOrchestrationService from "@services/AppOrchestrationService";

export const REGISTRATION_ID = "desktop-commander-debugger";

const DesktopCommanderDebuggerApp = {
  id: REGISTRATION_ID,
  title: "Desktop Commander Debugger",
  style: {
    width: 640,
    height: 720,
  },
  serviceClasses: [DesktopCommanderControllerService, AppOrchestrationService],
  view: function View({ appServices, windowController }) {
    // DOM element of most recent command
    const [elCurrentCommand, _setElCurrentCommand] = useState(null);

    // Automatically scroll the command into view
    useEffect(() => {
      if (elCurrentCommand) {
        // IMPORTANT: Don't use scrollIntoView; it can cause layout problems
        // w/ the user interface if this window is partially moved off the page
        // elCurrentCommand.scrollIntoView();

        // FIXME: (jh) Refactor so this parentNode.parentNode isn't used
        elCurrentCommand.parentNode.parentNode.scrollTo({
          top: elCurrentCommand.offsetTop - 10,
          left: elCurrentCommand.offsetLeft - 10,
        });
      }
    }, [elCurrentCommand]);

    const [selectedWindowController, _setSelectedWindowController] =
      useState(null);

    const selectedWindowControllerUUID = selectedWindowController?.getUUID();

    const commandService = appServices[DesktopCommanderControllerService];
    const commands = commandService.getCommands();
    const lastCommand = commandService.getLastCommand();

    const appOrchestrationService = appServices[AppOrchestrationService];
    const appRuntimes = appOrchestrationService.getAppRuntimes();
    const appRuntimeWindowControllers = appRuntimes
      .map(appRuntime => ({
        appRuntime,
        windowController: appRuntime.getWindowController(),
      }))
      .filter(obj => obj.windowController);

    /**
     * Invoked when the user manually changes the window controller selection
     * in the dropdown menu.
     *
     * @return {void}
     */
    const handleSelectWindowControllerChange = useCallback(
      evt => {
        const uuid = evt.target.value;

        const windowController =
          appOrchestrationService.getWindowControllerWithUUID(uuid);

        _setSelectedWindowController(windowController);
      },
      [appOrchestrationService]
    );

    const activeWindowController =
      appOrchestrationService.getActiveWindowController();

    // Automatically set selectedWindowController
    useEffect(() => {
      let selectedWindowController;

      if (activeWindowController && appRuntimeWindowControllers.length > 1) {
        // Don't automatically set this window as the selected window
        // controller if clicking on it (otherwise, it would be hard to control
        // the other windows without jumping through hoops)
        if (activeWindowController !== windowController) {
          selectedWindowController = activeWindowController;
        }
      } else {
        selectedWindowController = windowController;
      }

      if (selectedWindowController) {
        _setSelectedWindowController(selectedWindowController);
      }
    }, [activeWindowController, windowController, appRuntimeWindowControllers]);

    return (
      <Layout>
        <Content>
          <Center canOverflow>
            <Padding>
              {Object.values(commands).map(command => {
                const isCurrentCommand = command === lastCommand;

                return (
                  <div
                    ref={el => isCurrentCommand && _setElCurrentCommand(el)}
                    key={command.id}
                    style={{
                      width: 250,
                      height: 100,
                      border: "1px #999 solid",
                      borderRadius: 8,
                      margin: 1,
                      display: "inline-block",
                      textAlign: "left",
                      backgroundColor: isCurrentCommand ? "green" : null,
                    }}
                  >
                    <Layout>
                      <Content>
                        <Padding style={{ overflowY: "auto" }}>
                          <div>{command.description}</div>

                          <div
                            style={{
                              fontStyle: "italic",
                              fontSize: ".8em",
                              marginTop: 4,
                            }}
                          >
                            {command.keywords.join(" ")}
                          </div>
                        </Padding>
                      </Content>
                      <Footer style={{ textAlign: "right" }}>
                        <button
                          onClick={() =>
                            commandService.execCommand(command, {
                              windowController: selectedWindowController,
                            })
                          }
                          style={{
                            margin: 8,
                          }}
                        >
                          {command.id}
                        </button>
                      </Footer>
                    </Layout>
                  </div>
                );
              })}
            </Padding>
          </Center>
        </Content>
        <Footer>
          <hr />
          <Padding>
            <Center>
              <label>Choose a window to send a command:</label>{" "}
              <select
                onChange={handleSelectWindowControllerChange}
                value={selectedWindowControllerUUID}
              >
                <option>Choose a window</option>
                {appRuntimeWindowControllers.map(
                  ({ /* appRuntime, */ windowController }, idx) => (
                    <option key={idx} value={windowController.getUUID()}>
                      {windowController.getTitle()}
                    </option>
                  )
                )}
              </select>
            </Center>
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default DesktopCommanderDebuggerApp;
