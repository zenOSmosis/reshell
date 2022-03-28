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
        this._localStorageEngine.setItem(
          KEY_SESSION_STORAGE_APP_AUTOSTART,
          nextAutoStartConfigs
        );
      }
    });

    // Auto-load from cache
    //
    // FIXME: (jh) I'm not positive if this could potentially lead to a race
    // condition before setDefaultAppAutoStartConfig is externally called, or
    // if the config is used in the useAppRuntimesAutoStart hook. This might
    // need to be refactored.
    this._localStorageEngine.fetchItem(KEY_SESSION_STORAGE_APP_AUTOSTART).then(
      cachedAutoStartConfigs =>
        cachedAutoStartConfigs &&
        // TODO: Perform validation step
        this.setState({ appAutoStartConfigs: cachedAutoStartConfigs })
    );
  }

  /**
   * Sets the default AppRegistrations and priorities, should they not already
   * be available in the cache.
   *
   * @param {AppAutoStartConfigs} appAutoStartConfigs
   * @return {void}
   */
  setDefaultAppAutoStartConfigs(appAutoStartConfigs) {
    if (!Object.keys(this.getAppAutoStartConfigs()).length) {
      // TODO: Perform validation step

      this.setState({
        appAutoStartConfigs,
      });
    }
  }

  /**
   * Adds or updates the given AppRegistration and priority in the auto-start
   * sequence.
   *
   * @param {AppRegistration} appRegistration
   * @param {number} priority? [default=0] The higher the priority, the more
   * preference the window is given in the window stack.
   */
  setAutoStartAppRegistration(appRegistration, priority = 0) {
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

  /**
   * Removes the given AppRegistration from the auto-start.
   *
   * @param {AppRegistration} appRegistration
   */
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
   * Retrieves the auto-start configurations.
   *
   * @return {AutoStartConfigs}
   */
  getAppAutoStartConfigs() {
    return this.getState().appAutoStartConfigs;
  }

  /**
   * Retrieves a prioritized list of AppRegistration instances.
   *
   * @return {AppRegistration[]}
   */
  getPrioritizedAppAutoStartRegistrations() {
    const prioritizedAppAutoStartConfigs = Object.entries(
      this.getAppAutoStartConfigs()
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
