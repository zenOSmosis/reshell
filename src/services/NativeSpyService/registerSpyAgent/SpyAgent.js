import { PhantomState } from "phantom-core";
import persistentSpyAgentCollection from "../persistentSpyAgentCollection";

// TODO: Document
export default class SpyAgent extends PhantomState {
  /**
   * Create a reusable signature.
   *
   * TODO: Document parameters
   */
  static createSpyAgentSignature(spiesOn, initialState) {
    let spyAgent = null;

    return () => {
      if (
        !spyAgent ||
        spyAgent.getIsDestroying() ||
        spyAgent.getIsDestroyed()
      ) {
        spyAgent = new SpyAgent(spiesOn, initialState);
      }

      // TODO: Remove
      console.log({ spyAgent });

      return spyAgent;
    };
  }

  constructor(spiesOn, initialState = {}) {
    super(initialState);

    this._spiesOn = spiesOn;

    persistentSpyAgentCollection.addChild(this);

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
}
