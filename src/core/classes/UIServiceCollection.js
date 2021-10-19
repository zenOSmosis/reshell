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

// TODO: Refactor this handling into PhantomCore as optional single-instance (@see https://github.com/zenOSmosis/phantom-core/issues/72)
let _instance = null;

// IMPORTANT: This must be treated as a singleton for desktop usage
// TODO: Document
export default class UIServiceCollection extends PhantomCollection {
  constructor(...args) {
    // TODO: Refactor this handling into PhantomCore as optional single-instance (@see https://github.com/zenOSmosis/phantom-core/issues/72)
    if (_instance) {
      throw new ReferenceError(
        "UIServiceCollection cannot have multiple instances"
      );
    }

    super(...args);

    // TODO: Refactor this handling into PhantomCore as optional single-instance (@see https://github.com/zenOSmosis/phantom-core/issues/72)
    _instance = this;
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    // Destruct all services on collection destruct
    await this.destroyAllChildren();

    const ret = await super.destroy();

    // TODO: Refactor this handling into PhantomCore as optional single-instance (@see https://github.com/zenOSmosis/phantom-core/issues/72)
    _instance = null;

    return ret;
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
  // IMPORTANT: Making this async might be more trouble than its worth, if that
  // is ever a consideration
  startServiceClass(ServiceClass) {
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
    ServiceClass.prototype._useServiceClassHandler = ServiceClass =>
      this.startServiceClass(ServiceClass);

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
  async stopServiceClass(ServiceClass) {
    const cachedService = this.getChildWithKey(ServiceClass);

    if (cachedService) {
      cachedService.destroy();
    }
  }

  // TODO: Document
  getService(ServiceClass) {
    const cachedService = this.getChildWithKey(ServiceClass);

    return cachedService;
  }
}
