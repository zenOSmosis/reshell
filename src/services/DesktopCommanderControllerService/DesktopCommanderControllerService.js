import { getUnixTime } from "phantom-core";
import UIServiceCore, { EVT_UPDATE } from "@core/classes/UIServiceCore";

import AppOrchestrationService from "@services/AppOrchestrationService";
import UIParadigmService from "@services/UIParadigmService";

import * as COMMANDS from "./commands";

export { EVT_UPDATE };

// TODO: Document
// TODO: Rename
// TODO: Don't make extensible
export default class DesktopCommanderControllerService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Desktop Commander Controller Service");

    this.setState({
      lastCommand: null,
      lastCommandInvokeTime: null,
    });

    this._appOrchestrationService = this.useServiceClass(
      AppOrchestrationService
    );

    this._uiParadigmService = this.useServiceClass(UIParadigmService);

    // TODO: Use map instead?
    this._commands = {};

    // TODO: Iterate over commands and register each one
    // TODO: Remove
    for (const commandId of Object.keys(COMMANDS)) {
      const command = COMMANDS[commandId];

      this.registerCommand(command);
    }
  }

  /**
   * @return {Object}
   */
  getCommands() {
    return this._commands;
  }

  // TODO: Document
  registerCommand(command) {
    // TODO: Ensure each command has a unique name

    // TODO: Validate command structure

    if (typeof command.keywords === "string") {
      command.keywords = command.keywords.split(" ");
    }

    this._commands[command.id] = command;
  }

  // TODO: Document
  getCommandWithId(commandId) {
    return this._commands[commandId];
  }

  // TODO: Document
  getLastCommand() {
    return this.getState().lastCommand;
  }

  /**
   * Retrieves the UNIX time regarding when the most recent command was
   * invoked.
   *
   * @return {number}
   */
  getLastCommandInvokeTime() {
    return this.getState().lastCommandInvokeTime;
  }

  // TODO: Document
  // TODO: This could be an async operation, so potentially treat it as so
  async execCommand(command, params = {}) {
    if (!params.windowController) {
      const activeWindowController =
        this._appOrchestrationService.getActiveWindowController();

      // FIXME: (jh) This side-steps an issue where no window controller might
      // be available at all, so select ANY window controller just to have
      // something selected
      if (activeWindowController) {
        params.windowController = activeWindowController;
      } else {
        params.windowController =
          this._appOrchestrationService.getWindowControllers()?.[0];
      }
    }

    params.appOrchestrationService = this._appOrchestrationService;
    params.uiParadigmService = this._uiParadigmService;

    // TODO: Handle condition where no active (in-front) window controller is
    // present and there are running apps (should we show a UI notification?)

    this.setState({
      lastCommand: command,
      lastCommandInvokeTime: getUnixTime(),
    });

    // Execute the command
    return command.action(this, params);
  }
}
