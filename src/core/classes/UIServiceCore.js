// TODO: Add this to PhantomCore repository
import PhantomCore, {
  PhantomCollection,
  EVT_UPDATED,
  EVT_DESTROYED,
} from "phantom-core";

export { EVT_UPDATED, EVT_DESTROYED };

// TODO: Configure reporter channel (base class PhantomState, SyncObject or
// equivalent (not sure if SyncObject would be useful here, but could enable
// remote reporting))
//
// TODO: Base off of node.js-able module in PhantomCore (i.e. PhantomServiceCore, or similar)
//
// TODO: Document
//
// TODO: Consider this: Thought about extending PhantomCollection, instead,
// since retaining a localized state of children (which happen to be
// collections as well), but want to keep it open to the possibility of
// managing other types of collection-type data without the possibility of a
// conflict (i.e. collections based on role, etc.)
export default class UIServiceCore extends PhantomCore {
  constructor(initialState = {}) {
    const DEFAULT_STATE = {};

    super();

    if (typeof this._useServiceHandler !== "function") {
      throw new ReferenceError(
        "_useServiceHandler property should be set by the collection this service is collected in"
      );
    }

    this._state = Object.seal(
      UIServiceCore.mergeOptions(DEFAULT_STATE, initialState)
    );

    // A map of collections, attached to this service core
    this._collectionMap = new Map();

    // Set default title
    this.setTitle(`[non-aliased-service]:${this.getClassName()}`);

    // TODO: Include ability to dynamically link in Providers to a service so
    // that the same providers will be available to all consumers of the
    // service

    // Rebind each method to this instance so that buttons, etc. can be mapped
    // directly to serviceCore methods without an intermediate handler
    // TODO: Move to PhantomCore (@see https://github.com/zenOSmosis/phantom-core/issues/74)
    // @see [for how to test] https://github.com/sindresorhus/auto-bind
    this.getMethodNames().forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    // Destruct all attached collections
    await Promise.all(
      [...this._collectionMap.values()].map(collection => collection.destroy())
    );

    return super.destroy();
  }

  // TODO: Document
  useService(ServiceClass) {
    return this._useServiceHandler(ServiceClass);
  }

  /**
   * @param {PhantomCollection} CollectionClass
   * @return {PhantomCollection} instance
   */
  getCollectionInstance(CollectionClass) {
    return this._collectionMap.get(CollectionClass);
  }

  /**
   * Binds a non-instantiated PhantomCollection to this service, propagating
   * EVT_UPDATED through the class.
   *
   * IMPORTANT: Bound collection classes shared with multiple services using
   * bindCollectionClass will use separate instances of the collection.
   *
   * @param {PhantomCollection} CollectionClass
   * @return {void}
   */
  bindCollectionClass(CollectionClass) {
    const collectionInstance = new CollectionClass();

    // FIXME: (jh) A better check would be to determine this before
    // instantiation, if possible
    if (!(collectionInstance instanceof PhantomCollection)) {
      throw new TypeError("collectionInstance is not a PhantomCollection");
    }

    // Proxy collection EVT_UPDATED through the service core
    this.proxyOn(collectionInstance, EVT_UPDATED, () => this.emit(EVT_UPDATED));

    this._collectionMap.set(CollectionClass, collectionInstance);
  }

  // TODO: Document
  unbindCollectionClass(CollectionClass) {
    const instance = this.getCollectionInstance(CollectionClass);

    if (instance) {
      instance.destroy();
    }
  }

  // TODO: Implement optional profiling?
  // TODO: Document
  setState(partialNextState = {}) {
    // IMPORTANT: This state is only shallow merged due to deep merging not
    // working for certain native types
    this._state = { ...this._state, ...partialNextState };

    this.emit(EVT_UPDATED, partialNextState);
  }

  // TODO: Document
  getState() {
    return this._state;
  }
}
