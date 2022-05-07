import UIServiceCore, {
  EVT_UPDATED,
  EVT_DESTROYED,
} from "@core/classes/UIServiceCore";

import AppRegistration from "./classes/AppRegistration";
import AppRegistrationCollection from "./classes/AppRegistrationCollection";

import AppRuntime from "./classes/AppRuntime";
import AppRuntimeCollection from "./classes/AppRuntimeCollection";

import DesktopService from "@services/DesktopService";

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

    this._desktopService = this.useServiceClass(DesktopService);
  }

  // TODO: Import WindowController type
  /**
   * Retrieves all of the window controllers for all of the running apps.
   *
   * @return {WindowController[]}
   */
  getWindowControllers() {
    return this.getAppRuntimes()
      .map(runtime => runtime.getWindowController())
      .filter(windowController => windowController);
  }

  // TODO: Document
  getActiveAppRegistration() {
    return this.getActiveWindowController()?.getAppRegistration();
  }

  // TODO: Document
  getActiveAppRuntime() {
    return this.getActiveWindowController()?.getAppRuntime();
  }

  // TODO: Document
  getActiveWindowController() {
    return this._desktopService.getActiveWindowController();
  }

  // TODO: Import WindowController type
  /**
   * Retrieves the window controller with the given UUID.
   *
   * @param {uuid} string
   * @return {WindowController | void}
   */
  getWindowControllerWithUUID(uuid) {
    let matchedWindowController;

    for (const windowController of this.getWindowControllers()) {
      if (windowController.getUUID() === uuid) {
        matchedWindowController = windowController;
        break;
      }
    }

    return matchedWindowController;
  }

  /**
   * Retrieves the app registration title associated with the given app
   * registration ID.
   *
   * @param {string} appRegistrationID
   * @return {string | void}
   */
  getAppRegistrationTitleWithID(appRegistrationID) {
    const appRegistration = this._appRegistrationCollection
      .getAppRegistrations()
      .find(predicate => predicate.getID() === appRegistrationID);

    if (!appRegistration) {
      console.warn(
        `Could not locate appRegistration with id: ${appRegistrationID}`
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
    const appRuntime = new AppRuntime(appRegistration, this);

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
    if (!this.getRunningAppRegistrations().includes(appRegistration)) {
      // Open app w/ registration
      this._launchAppRegistration(appRegistration);
    } else {
      // Move grouped windows to top
      //
      // TODO: Incorporate this logic:
      // "The user can also click an app’s Dock icon to bring all of that app’s
      // windows forward; the most recently accessed app window becomes the key
      // window."
      // (Ref. "Activating Windows": https://developer.apple.com/design/human-interface-guidelines/macos/windows-and-views/window-anatomy/)
      //
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
  activateAppRegistrationWithID(appRegistrationID) {
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
   * Retrieves the currently registered app with the given ID.
   *
   * @param {string} appRegistrationID
   * @return {AppRegistration | void}
   */
  getAppRegistrationWithID(appRegistrationID) {
    return this.getAppRegistrations().find(
      registration => registration.getID() === appRegistrationID
    );
  }

  /**
   * Retrieves the current AppRegistration instances associated with running
   * AppRuntime instances.
   *
   * NOTE: This is not named "getActiveAppRegistrations" because the "active"
   * connotes the top-most window.
   *
   * @return {AppRegistration[]}
   */
  getRunningAppRegistrations() {
    return [
      ...new Set(
        this.getAppRuntimes().map(runtime => runtime.getRegistration())
      ),
    ];
  }

  /**
   * Retrieves whether or not an AppRegistration with the given ID is running.
   *
   * @param {string} appRegistrationID
   * @return {boolean}
   */
  getIsAppRegistrationRunningWithID(appRegistrationID) {
    return Boolean(
      this.getRunningAppRegistrations().find(
        registration => registration.getID() === appRegistrationID
      )
    );
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
