import UIServiceCore, {
  EVT_UPDATED,
  EVT_DESTROYED,
} from "@core/classes/UIServiceCore";

import AppRegistration from "./classes/AppRegistration";
import AppRegistrationCollection from "./classes/AppRegistrationCollection";

import AppRuntime from "./classes/AppRuntime";
import AppRuntimeCollection from "./classes/AppRuntimeCollection";

export { EVT_UPDATED, EVT_DESTROYED };

/**
 * Manages the collection, starting, and stopping of AppRuntime instances.
 */
export default class AppOrchestrationService extends UIServiceCore {
  // TODO: Document
  constructor(...args) {
    super(...args);

    this.setTitle("App Orchestration Service");

    this._appRegistrationCollection = this.bindCollectionClass(
      AppRegistrationCollection
    );
    this._appRuntimeCollection = this.bindCollectionClass(AppRuntimeCollection);
  }

  /**
   * Retrieves the app registration title associated with the given app
   * descriptor ID.
   *
   * @param {string} appDescriptorID
   * @return {string | void}
   */
  getAppRegistrationTitleWithDescriptorID(appDescriptorID) {
    const appRegistration = this._appRegistrationCollection
      .getAppRegistrations()
      .find(predicate => predicate.getID() === appDescriptorID);

    if (!appRegistration) {
      console.warn(
        `Could not locate appRegistration with id: ${appDescriptorID}`
      );
    } else {
      return appRegistration.getTitle();
    }
  }

  /**
   * Registers, or updates, the AppRegistration cache with the given app
   * descriptor.
   *
   * This is used primarily for applications menu population.
   *
   * @param {Object} // TODO: Document AppDescriptor type
   * @return {void}
   */
  addOrUpdateAppRegistration(appDescriptor) {
    const appRegistration =
      AppRegistration.addOrUpdateAppRegistration(appDescriptor);

    // TODO: Will this actually update the registration?
    this._appRegistrationCollection.addAppRegistration(appRegistration);
  }

  // TODO: Implement removeAppRegistration (this._appRegistrationCollection.removeAppRegistration)

  // TODO: Ensure app registration is either not already active, or that it
  // supports multiple windows before trying to start multiple instances
  /**
   * Provides core launching capability for the given AppRegistration.
   *
   * @param {AppRegistration} appRegistration
   * @return {AppRuntime}
   */
  _launchAppRegistration(appRegistration) {
    const appRuntime = new AppRuntime(appRegistration);

    this._appRuntimeCollection.addAppRuntime(appRuntime);

    return appRuntime;
  }

  /**
   * Activates (i.e. brings to front), or launches, the given AppRegistration.
   *
   * @param {AppRegistration} appRegistration
   * @return {void}
   */
  activateAppRegistration(appRegistration) {
    if (!this.getActiveAppRegistrations().includes(appRegistration)) {
      // TODO: Open app w/ registration
      this._launchAppRegistration(appRegistration);
    } else {
      // Move grouped windows to top
      // TODO: Order by window manager stacking order (most recently used
      // window in group should appear in top)
      // TODO: Refactor into window manager?
      this.getAppRuntimes()
        .filter(runtime => runtime.getRegistration() === appRegistration)
        .forEach(runtime => runtime.bringToTop());
    }
  }

  /**
   * Activates (i.e. brings to front), or launches, an AppRegistration with the
   * given ID.
   *
   * @param {string} appRegistrationID
   * @return {void}
   */
  activateAppRegistrationID(appRegistrationID) {
    const appRegistration = this.getAppRegistrations().find(
      predicate => predicate.getID() === appRegistrationID
    );

    if (!appRegistration) {
      this.log.warn(`Unknown appRegistration with id: ${appRegistrationID}`);
    } else {
      this.activateAppRegistration(appRegistration);
    }
  }

  /**
   * NOTE: This is purely a convenience method; it oes not have to be called
   * directly on this service if destructing the AppRuntime instance directly.
   *
   *
   * @param {AppRuntime} appRuntime
   * @return {Promise<void>}
   */
  async closeAppRuntime(appRuntime) {
    return appRuntime.destroy();
  }

  /**
   * Retrieves the currently registered apps, used to populate application
   * menus.
   *
   * @return {AppRegistration[]}
   */
  getAppRegistrations() {
    return this._appRegistrationCollection.getAppRegistrations();
  }

  /**
   * Retrieves the current AppRegistration instances associated with running
   * AppRuntime instances.
   *
   * @return {AppRegistration[]}
   */
  getActiveAppRegistrations() {
    return [
      ...new Set(
        this.getAppRuntimes().map(runtime => runtime.getRegistration())
      ),
    ];
  }

  /**
   * Retrieves the currently running AppRuntime instances.
   *
   * @return {AppRuntime[]}
   */
  getAppRuntimes() {
    return this._appRuntimeCollection.getAppRuntimes();
  }

  /**
   * Retrieves the currently running AppRuntime instances with the given app
   * registration ID.
   *
   * @param {string} appRegistrationID
   * @return {AppRuntime[]}
   */
  getAppRuntimesWithRegistrationID(appRegistrationID) {
    return this.getAppRuntimes().filter(
      appRuntime => appRuntime.getRegistrationID() === appRegistrationID
    );
  }
}
