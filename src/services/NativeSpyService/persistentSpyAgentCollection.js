import { PhantomCollection } from "phantom-core";
import SpyAgentCore from "./spies/SpyAgentCore";

// TODO: Rename?
// TODO: Document
class SpyAgentCollection extends PhantomCollection {
  /**
   * @param {SpyAgent} spyAgent SpyAgentCore instance
   * @return {void}
   */
  addChild(spyAgent) {
    if (!spyAgent instanceof SpyAgentCore) {
      throw new TypeError("spyAgent is not a SpyAgentCore");
    }

    // TODO: Ensure spyAgent extends SpyAgentCore, and is not the core itself
    // (somewhat related issue, but not quite: https://github.com/zenOSmosis/phantom-core/issues/155)

    return super.addChild(spyAgent);
  }
}

// Use as a singleton
export default new SpyAgentCollection();
