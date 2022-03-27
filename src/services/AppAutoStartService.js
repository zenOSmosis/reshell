import UIServiceCore from "@core/classes/UIServiceCore";
import AppRegistration from "./AppOrchestrationService/classes/AppRegistration";

/**
 * @typedef {{[key: string], priority: number}} AppAutoStartConfigs
 */

/**
 * Manages which applications should automatically start once ReShell loads.
 */
export default class AppAutoStartService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("App Auto Start Service");

    this.setState({
      /** @type {AppAutoStartConfigs} */
      autoStartConfigs: {},
    });
  }

  // TODO: Document
  importAutoStartAppRegistrations() {
    // TODO: Parse string and recursively set auto start registrations
  }

  // TODO: Document
  setAutoStartAppRegistration(appRegistration, priority = null) {
    if (!(appRegistration instanceof AppRegistration)) {
      throw new TypeError("appRegistration is not an AppRegistration");
    }

    // TODO: Remove
    console.log({ appRegistration, priority });

    const nextAutoStartConfigs = { ...this.getState().autoStartConfigs };
    nextAutoStartConfigs[appRegistration.getAppDescriptorID()] = {
      priority,
    };

    this.setState({
      autoStartConfigs: nextAutoStartConfigs,
    });

    // TODO: Cache in local storage
  }

  // TODO: Document
  removeAutoStartAppRegistration(appRegistration) {
    if (!(appRegistration instanceof AppRegistration)) {
      throw new TypeError("appRegistration is not an AppRegistration");
    }

    const nextAutoStartConfigs = { ...this.getState().autoStartConfigs };
    delete nextAutoStartConfigs[appRegistration.getAppDescriptorID()];

    this.setState({
      autoStartConfigs: nextAutoStartConfigs,
    });

    // TODO: Cache in local storage
  }

  /**
   * @return {AutoStartConfigs}
   */
  getAutoStartConfigs() {
    return this.getState().autoStartConfigs;
  }
}
