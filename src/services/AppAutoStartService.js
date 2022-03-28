import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";
import AppRegistration from "./AppOrchestrationService/classes/AppRegistration";

import KeyVaultService from "@services/KeyVaultService";
import AppOrchestrationService from "@services/AppOrchestrationService";

/**
 * @typedef {{[key: string], priority: number}} AppAutoStartConfigs
 */

const KEY_SESSION_STORAGE_APP_AUTOSTART = "app-autostart";

/**
 * Manages which applications should automatically start once ReShell loads.
 */
export default class AppAutoStartService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("App Auto Start Service");

    this.setState({
      /** @type {AppAutoStartConfigs} */
      appAutoStartConfigs: {},
    });

    this._appOrchestrationService = this.useServiceClass(
      AppOrchestrationService
    );

    this._keyVaultService = this.useServiceClass(KeyVaultService);

    this._localStorageEngine =
      this._keyVaultService.getSecureLocalStorageEngine();
    this.registerCleanupHandler(() => (this._localStorageEngine = null));

    // Auto-cache auto start configs
    this.on(EVT_UPDATED, updatedState => {
      const nextAutoStartConfigs = updatedState.appAutoStartConfigs;

      if (nextAutoStartConfigs !== undefined) {
        // TODO: Change to debug
        this.log({ nextAutoStartConfigs });

        this._localStorageEngine.setItem(
          KEY_SESSION_STORAGE_APP_AUTOSTART,
          nextAutoStartConfigs
        );
      }
    });
  }

  /**
   * @param {AppAutoStartConfigs} appAutoStartConfigs
   * @return {void}
   */
  setDefaultAppAutoStartConfigs(appAutoStartConfigs) {
    if (!Object.keys(this.getAutoStartConfigs()).length) {
      // TODO: Perform validation step

      this.setState({
        appAutoStartConfigs,
      });
    }
  }

  // TODO: Document
  setAutoStartAppRegistration(appRegistration, priority = null) {
    if (!(appRegistration instanceof AppRegistration)) {
      throw new TypeError("appRegistration is not an AppRegistration");
    }

    const nextAutoStartConfigs = { ...this.getState().appAutoStartConfigs };
    nextAutoStartConfigs[appRegistration.getAppDescriptorID()] = {
      priority,
    };

    this.setState({
      appAutoStartConfigs: nextAutoStartConfigs,
    });
  }

  // TODO: Document
  removeAutoStartAppRegistration(appRegistration) {
    if (!(appRegistration instanceof AppRegistration)) {
      throw new TypeError("appRegistration is not an AppRegistration");
    }

    const nextAutoStartConfigs = { ...this.getState().appAutoStartConfigs };
    delete nextAutoStartConfigs[appRegistration.getAppDescriptorID()];

    this.setState({
      appAutoStartConfigs: nextAutoStartConfigs,
    });
  }

  /**
   * @return {AutoStartConfigs}
   */
  getAutoStartConfigs() {
    return this.getState().appAutoStartConfigs;
  }

  // TODO: Document
  getPrioritizedAppAutoStartRegistrations() {
    const prioritizedAppAutoStartConfigs = Object.entries(
      this.getAutoStartConfigs()
    )
      .sort(
        (
          [registrationID_A, metadata_A = {}],
          [registrationID_B, metadata_B = {}]
        ) => {
          if (metadata_A.priority < metadata_B.priority) {
            return -1;
          } else {
            return 1;
          }
        }
      )
      .map(([registrationID]) =>
        this._appOrchestrationService.getAppRegistrationWithID(registrationID)
      )
      .filter(registration => registration);

    return prioritizedAppAutoStartConfigs;
  }
}
