import { PhantomCollection } from "phantom-core";
import UIServiceCore from "../../../../classes/UIServiceCore";

const {
  EVT_CHILD_INSTANCE_ADDED,
  EVT_CHILD_INSTANCE_REMOVED,
  EVT_UPDATED,
  EVT_DESTROYED,
} = PhantomCollection;

export {
  EVT_CHILD_INSTANCE_ADDED,
  EVT_CHILD_INSTANCE_REMOVED,
  EVT_UPDATED,
  EVT_DESTROYED,
};

export default class UIServiceCollection extends PhantomCollection {
  // addService
  // removeService
  // TODO: Destruct all services on collection destruct

  // TODO: Document
  addChild(service, serviceClass) {
    if (!(service instanceof UIServiceCore)) {
      throw new TypeError("service is not a UIServiceCore instance");
    }

    return super.addChild(service, serviceClass);
  }

  // TODO: Document
  addServiceClass(serviceClass) {
    const cachedService = this.getChildWithKey(serviceClass);

    if (cachedService) {
      return cachedService;
    }

    const service = new serviceClass();

    this.addChild(service, serviceClass);

    return service;
  }

  // TODO: Document
  removeServiceClass(serviceClass) {
    const cachedService = this.getChildWithKey(serviceClass);

    if (cachedService) {
      this.removeChild(cachedService);
    }
  }
}
