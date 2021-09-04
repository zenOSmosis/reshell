import { PhantomCollection } from "phantom-core";
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

  addServiceClass(serviceClass) {
    const service = new serviceClass();

    this.addChild(service, serviceClass);
  }
}
