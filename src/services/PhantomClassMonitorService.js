import UIServiceCore from "@core/classes/UIServiceCore";
import {
  PhantomWatcher,
  EVT_UPDATE,
  // EVT_PHANTOM_WATCHER_LOG_MISS,
} from "phantom-core";

// TODO: Implement ability to store / retrieve log settings from local storage

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

    // TODO: Handle accordingly
    /*
    this.proxyOn(this._phantomWatcher, EVT_PHANTOM_WATCHER_LOG_MISS, data => {
      console.log("log miss", data);
    });
    */
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

  // TODO: Document
  getInitialGlobalLogLevel() {
    return this._phantomWatcher.getInitialGlobalLogLevel();
  }

  // TODO: Document
  getHasGlobalLogLevelChanged() {
    return this._phantomWatcher.getHasGlobalLogLevelChanged();
  }

  // TODO: Document
  resetGlobalLogLevel() {
    return this._phantomWatcher.resetGlobalLogLevel();
  }

  // TODO: Document
  getTotalPhantomInstances(phantomClassName) {
    return this._phantomWatcher.getTotalPhantomInstances();
  }

  // TODO: Document
  getTotalPhantomInstancesWithClassName(phantomClassName) {
    return this._phantomWatcher.getTotalPhantomInstancesWithClassName(
      phantomClassName
    );
  }
}
