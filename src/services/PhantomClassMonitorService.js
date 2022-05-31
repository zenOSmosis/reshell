import UIServiceCore from "@core/classes/UIServiceCore";
import {
  PhantomWatcher,
  EVT_UPDATE,
  EVT_PHANTOM_WATCHER_LOG_MISS,
  // LogLevel,
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

    // Force re-render on log misses as well
    // FIXME: (jh) This may need to be reworked as necessary if it causes
    // performance issues (maybe processed and debounced via a web worker)
    this.proxyOn(this._phantomWatcher, EVT_PHANTOM_WATCHER_LOG_MISS, () => {
      this.emit(EVT_UPDATE);
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

  // TODO: Document
  getPhantomClassLogMisses(phantomClassName) {
    return this._phantomWatcher.getPhantomClassLogMisses(phantomClassName);
  }
}
