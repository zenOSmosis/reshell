// TODO: Add this to PhantomCore repository
import PhantomCore, {
  PhantomCollection,
  EVT_UPDATED,
  EVT_DESTROYED,
} from "phantom-core";

export { EVT_UPDATED, EVT_DESTROYED };

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

    this._state = Object.seal(
      UIServiceCore.mergeOptions(DEFAULT_STATE, initialState)
    );

    // A map of collections, attached to this service core
    this._collectionMap = new Map();

    // Set default title
    this.setTitle(`[non-aliased-service]:${this.getClassName()}`);
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    // Destruct all attached collections
    await Promise.all(
      [...this._collectionMap].map((collection) => collection.destroy())
    );

    return super.destroy();
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