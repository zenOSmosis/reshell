import {
  PhantomCollection,
  EVT_CHILD_INSTANCE_ADDED,
  EVT_CHILD_INSTANCE_REMOVED,
  EVT_UPDATED,
  EVT_DESTROYED,
} from "phantom-core";

import AppRegistration from "./AppRegistration";

export {
  EVT_CHILD_INSTANCE_ADDED,
  EVT_CHILD_INSTANCE_REMOVED,
  EVT_UPDATED,
  EVT_DESTROYED,
};

// TODO: Document
export default class AppRegistrationCollection extends PhantomCollection {
  addChild(appRegistration) {
    if (!(appRegistration instanceof AppRegistration)) {
      throw new TypeError("appRegistration is not an AppRegistration");
    }

    return super.addChild(appRegistration);
  }

  /**
   * @param {AppRegistration} appRegistration
   * @return {void}
   */
  addAppRegistration(appRegistration) {
    return this.addChild(appRegistration);
  }

  /**
   *
   * @param {AppRegistration} appRegistration
   * @return {void}
   */
  removeAppRegistration(appRegistration) {
    return this.removeChild(appRegistration);
  }

  /**
   * @return {AppRegistration[]}
   */
  getAppRegistrations() {
    return this.getChildren();
  }
}
