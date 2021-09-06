import { PhantomCollection } from "phantom-core";
import UIServiceCore from "@core/classes/UIServiceCore";

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
  addChild(service, ServiceClass) {
    if (!(service instanceof UIServiceCore)) {
      throw new TypeError("service is not a UIServiceCore instance");
    }

    return super.addChild(service, ServiceClass);
  }

  // TODO: Document
  addServiceClass(ServiceClass) {
    const cachedService = this.getChildWithKey(ServiceClass);

    if (cachedService) {
      return cachedService;
    }

    const service = new ServiceClass();

    this.addChild(service, ServiceClass);

    return service;
  }

  // TODO: Document
  removeServiceClass(ServiceClass) {
    const cachedService = this.getChildWithKey(ServiceClass);

    if (cachedService) {
      this.removeChild(cachedService);

      // TODO: Destruct service? (note: If so, it should
      // automatically remove it from the children)
    }
  }
}
