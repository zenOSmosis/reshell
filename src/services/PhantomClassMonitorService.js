import UIServiceCore from "@core/classes/UIServiceCore";
import { PhantomWatcher, EVT_UPDATE } from "phantom-core";

// TODO: Document
export default class PhantomClassMonitorService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setState({
      phantomClassNames: [],
    });

    this._phantomWatcher = new PhantomWatcher();

    this.proxyOn(this._phantomWatcher, EVT_UPDATE, () => {
      this.setState({
        phantomClassNames: this._phantomWatcher.getPhantomClassNames(),
      });
    });
  }

  // TODO: Document
  getPhantomClassNames() {
    return this.getState().phantomClassNames;
  }

  // TODO: Document
  setGlobalLogLevel(logLevel) {
    return this._phantomWatcher.setGlobalLogLevel(logLevel);
  }

  // TODO: Document
  getGlobalLogLevel() {
    return this._phantomWatcher.getGlobalLogLevel();
  }

  // TODO: Document
  setPhantomClassLogLevel(phantomClassName, logLevel) {
    return this._phantomWatcher.setPhantomClassLogLevel(
      phantomClassName,
      logLevel
    );
  }

  // TODO: Document
  getPhantomClassLogLevel(phantomClassName) {
    return this._phantomWatcher.getPhantomClassLogLevel(phantomClassName);
  }
}
