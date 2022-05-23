import { PhantomState, EVT_UPDATE, EVT_BEFORE_DESTROY } from "phantom-core";
import { getClassName } from "phantom-core";
import persistentSpyAgentCollection from "../persistentSpyAgentCollection";

// TODO: Document
export default class SpyAgent extends PhantomState {
  /**
   * Create a reusable signature.
   *
   * TODO: Document parameters
   */
  static createSpyAgentSignature(spiesOn, initialState) {
    /** @type {Map<any, SpyAgent>} */
    const spyAgentMap = new Map();

    return (scope, updatedState = {}) => {
      let spyAgent = spyAgentMap.get(scope);

      if (
        !spyAgent ||
        spyAgent.UNSAFE_getIsDestroying() ||
        spyAgent.UNSAFE_getIsDestroyed()
      ) {
        spyAgent = new SpyAgent(spiesOn, initialState);

        spyAgentMap.set(scope, spyAgent);

        // Remove from scope once entering shutdown phase
        spyAgent.once(EVT_BEFORE_DESTROY, () => {
          // Note: While this prev check shouldn't be necessary it provides
          // double-assurance that we're not accidentally deleting a scoped
          // instance that we shouldn't be
          const prev = spyAgentMap.get(scope);
          if (prev === spyAgent) {
            spyAgentMap.delete(scope);
          }
        });
      }

      spyAgent.setState(updatedState);

      return spyAgent;
    };
  }

  constructor(spiesOn, initialState = {}) {
    super(initialState);

    this._spiesOn = spiesOn;
    this._spiesOnClassName = getClassName(spiesOn);

    persistentSpyAgentCollection.addChild(this);

    // Obtain agent title from state
    this.on(EVT_UPDATE, updatedState => {
      const { address, url } = updatedState || {};

      if (address || url) {
        this.setTitle(address || url);
      }
    });

    this.registerCleanupHandler(() => {
      // FIXME: (jh) Ensure PhantomState itself prevents memory leaks on its
      // own by resetting its state internally on cleanup
      this.setState({});

      persistentSpyAgentCollection.removeChild(this);
    });
  }

  // TODO: Document
  getSpiesOn() {
    return this._spiesOn;
  }

  /**
   * @return {string}
   */
  getSpiedOnClassName() {
    return this._spiesOnClassName;
  }
}
