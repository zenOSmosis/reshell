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

// TODO: Document
export default class UIServiceCollection extends PhantomCollection {
  /**
   * @return {Promise<void>}
   */
  async destroy() {
    // Destruct all services on collection destruc
    await this.destroyAllChildren();

    super.destroy();
  }

  // TODO: Document
  addChild(service, ServiceClass) {
    if (!(service instanceof UIServiceCore)) {
      throw new TypeError("service is not a UIServiceCore instance");
    }

    return super.addChild(service, ServiceClass);
  }

  // TODO: Document
  // TODO: Refactor most of this into addChild, directly
  addServiceClass(ServiceClass) {
    const cachedService = this.getChildWithKey(ServiceClass);

    if (cachedService) {
      return cachedService;
    }

    // Bind functionality to the service to be able to use other services,
    // using this service collection as the backend
    //
    // NOTE: This was engineered this way in order to not have to pass
    // arguments to the ServiceClass itself, thus making it easier to extend
    // services without having to think about needed constructor arguments
    ServiceClass.prototype._useServiceHandler = ServiceClass =>
      this.useService(ServiceClass);

    // NOTE: Services are instantiated with the collection without arguments,
    // but may pass arguments down to the base ServiceCore class (i.e. for
    // setting initial state) in extension classes.  The extension classes
    // themselves won't be instantiated with any arguments set, however, by the
    // collection.
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

  // TODO: Document
  useService(ServiceClass) {
    const cachedService = this.getChildWithKey(ServiceClass);

    if (cachedService) {
      return cachedService;
    } else {
      return this.addServiceClass(ServiceClass);
    }
  }
}
