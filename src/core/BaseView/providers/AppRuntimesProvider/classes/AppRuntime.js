import PhantomCore, { EVT_UPDATED, EVT_DESTROYED } from "phantom-core";
import AppRegistration from "../../AppRegistrationsProvider/classes/AppRegistration";

export { EVT_UPDATED, EVT_DESTROYED };

// TODO: Include ability to load preload resources, with states representing before / after preloading
// TODO: Include ability to register splash screen, while preloading

// TODO: Document
export default class AppRuntime extends PhantomCore {
  // TODO: Document
  constructor(appRegistration) {
    if (!(appRegistration instanceof AppRegistration)) {
      throw new TypeError("appRegistration is not an AppRegistration");
    }

    super();

    this._appRegistration = appRegistration;

    // Emit EVT_UPDATED out runtime when the registration updates
    this.proxyOn(this._appRegistration, EVT_UPDATED, () => {
      this.emit(EVT_UPDATED);
    });

    // Destruct runtime when registration destructs
    this.proxyOn(this._appRegistration, EVT_DESTROYED, () => {
      this.destroy();
    });
  }

  // TODO: Document
  getAppDescriptor() {
    return this._appRegistration.getAppDescriptor();
  }
}
