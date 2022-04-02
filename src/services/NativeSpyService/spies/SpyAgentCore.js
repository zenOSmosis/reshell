import { PhantomState } from "phantom-core";
import persistentSpyAgentCollection from "../persistentSpyAgentCollection";

// TODO: Document
export default class SpyAgentCore extends PhantomState {
  static createSpyAgent(spiesOn, initialState = {}) {
    return new SpyAgentCore(spiesOn, initialState);
  }

  constructor(spiesOn, initialState = {}) {
    super({ ...initialState, spiesOn });

    persistentSpyAgentCollection.addChild(this);

    this.registerCleanupHandler(() => {
      // FIXME: (jh) Ensure PhantomState itself prevents memory leaks on its
      // own by resetting its state internally on cleanup
      this.setState({});

      persistentSpyAgentCollection.removeChild(this);
    });
  }
}
