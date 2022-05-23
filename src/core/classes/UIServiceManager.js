import {
  PhantomServiceManager,
  EVT_UPDATED,
  EVT_DESTROYED,
} from "phantom-core";

// TODO: Change to namespaced export once PhantomCore supports package.json exports
// @see https://github.com/zenOSmosis/phantom-core/issues/98
import {
  EVT_CHILD_INSTANCE_ADDED,
  EVT_CHILD_INSTANCE_REMOVED,
} from "phantom-core";

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
export default class UIServiceManager extends PhantomServiceManager {
  constructor(...args) {
    // TODO: Refactor this handling into PhantomCore as optional single-instance (@see https://github.com/zenOSmosis/phantom-core/issues/72)
    if (_instance) {
      throw new ReferenceError(
        "UIServiceManager cannot have multiple instances"
      );
    }

    super(...args);

    // TODO: Refactor this handling into PhantomCore as optional single-instance (@see https://github.com/zenOSmosis/phantom-core/issues/72)
    _instance = this;
  }
}
