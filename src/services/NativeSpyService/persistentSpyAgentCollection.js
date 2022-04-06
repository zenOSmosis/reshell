import { PhantomCollection } from "phantom-core";
import SpyAgent from "./registerSpyAgent/SpyAgent";

// TODO: Rename?
// TODO: Document
class SpyAgentCollection extends PhantomCollection {
  /**
   * @param {SpyAgent} spyAgent SpyAgent instance
   * @return {void}
   */
  addChild(spyAgent) {
    if (!spyAgent instanceof SpyAgent) {
      throw new TypeError("spyAgent is not a SpyAgent");
    }

    return super.addChild(spyAgent);
  }
}

// Use as a singleton
export default new SpyAgentCollection();
