import PhantomCore, { EVT_UPDATED, EVT_DESTROYED } from "phantom-core";
import AppRegistration from "./AppRegistration";

export { EVT_UPDATED, EVT_DESTROYED };

// TODO: Include ability to load preload resources, with states representing before / after preloading
// TODO: Include ability to register splash screen, while preloading

// TODO: Document
export default class AppRuntime extends PhantomCore {
  // TODO: Implement ability to inherit base environment here
  // TODO: Implement ability to fork?
  // TODO: Implement ability to set initial environment

  // TODO: Document
  constructor(appRegistration, appOrchestrationService) {
    if (!(appRegistration instanceof AppRegistration)) {
      throw new TypeError("appRegistration is not an AppRegistration");
    }

    super();

    this._appRegistration = appRegistration;
    this._appOrchestrationService = appOrchestrationService;

    // Emit EVT_UPDATED out runtime when the registration updates
    this.proxyOn(this._appRegistration, EVT_UPDATED, data => {
      this.emit(EVT_UPDATED, data);
    });

    // Destruct runtime when registration destructs
    this.proxyOnce(this._appRegistration, EVT_DESTROYED, () => {
      if (!this.UNSAFE_getIsDestroying()) {
        this.destroy();
      }
    });

    this._windowController = null;

    this.registerCleanupHandler(async () => {
      if (!this.UNSAFE_getIsDestroying()) {
        this._windowController.destroy();
      }

      this._appRegistration = null;
      this._appOrchestrationService = null;
      this._windowController = null;

      // IMPORTANT: We only want to remove the registration, but don't want to
      // destruct the registration itself, as it should be reused
      delete this._appRegistration;
    });
  }

  // TODO: Document
  bringToTop() {
    if (this._windowController) {
      return this._windowController.bringToTop();
    }
  }

  // TODO: Document
  getIsActive() {
    return this === this._appOrchestrationService.getActiveAppRuntime();
  }

  // TODO: Document
  // Internally called by the window manager
  __INTERNAL__setWindowController(windowController) {
    // TODO: Verify windowController is a WindowController

    this._windowController = windowController;
  }

  // TODO: Document
  getWindowController() {
    return this._windowController;
  }

  // TODO: Document
  getRegistration() {
    return this._appRegistration;
  }

  // TODO: Document
  getRegistrationID() {
    return this._appRegistration.getID();
  }

  // TODO: Rename to getDescriptor? For instance, getRegistration isn't called
  // getAppRegistration; standardize on either name, but keep it consistent.
  // TODO: Document
  getAppDescriptor() {
    return this._appRegistration?.getAppDescriptor();
  }

  // TODO: Implement setEnvironment

  getEnvironment() {
    // TODO: Mix with runtime environment
    return process.env;
  }
}
