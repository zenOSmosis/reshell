import "@core/startupHelpers";

import PhantomCore from "phantom-core";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";

import UIServiceCollection from "../classes/UIServiceCollection";
import LocalDataPersistenceService from "@services/LocalDataPersistenceService";

import BaseView from "../BaseView";

import queryString from "query-string";

const KEY_SESSION_STORAGE_DEFAULT_PORTAL_NAME = "reshell-default-portal";

// TODO: Refactor this handling into PhantomCore as optional single-instance (@see https://github.com/zenOSmosis/phantom-core/issues/72)
let _instance = null;

export default class ReShellCore extends PhantomCore {
  // TODO: Document
  static async switchToPortal(portalName) {
    await _instance?.destroy();

    const urlQuery = queryString.stringify({ portalName });

    window.location.href = `?${urlQuery}`;
  }

  // TODO: Document
  static #portals = {};

  // TODO: Document
  static registerPortals(portals) {
    ReShellCore.#portals = portals;
  }

  // TODO: Document
  static getPortals() {
    return ReShellCore.#portals;
  }

  // TODO: Document
  static async init(portalName = null) {
    return new ReShellCore(portalName);
  }

  constructor(portalName = null) {
    // TODO: Refactor this handling into PhantomCore as optional single-instance (@see https://github.com/zenOSmosis/phantom-core/issues/72)
    if (_instance) {
      throw new ReferenceError(
        "UIServiceCollection cannot have multiple instances"
      );
    }

    super({
      isReady: false,
    });

    // TODO: Refactor this handling into PhantomCore as optional single-instance (@see https://github.com/zenOSmosis/phantom-core/issues/72)
    _instance = this;

    this._uiServiceCollection = new UIServiceCollection();
    this._uiServiceCollection.startServiceClass(LocalDataPersistenceService);

    // TODO: Bind window "beforeunload" event to try to prevent accidental shut
    // down before we have a chance to save states, etc. Ensure it gets unbound
    // before the destructor finishes.
    // @see https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload

    this._init(portalName);
  }

  // TODO: Document
  async _init(portalName) {
    const sessionStorageEngine = this._uiServiceCollection
      .getService(LocalDataPersistenceService)
      .getSessionStorageEngine();

    // If no portalName is passed and there is a session storage (not local) variable set for portal, use it
    if (!portalName) {
      portalName =
        // Retrieve portal name from session storage
        (await sessionStorageEngine.fetchItem(
          KEY_SESSION_STORAGE_DEFAULT_PORTAL_NAME
        )) || "default";
    }

    const portal = ReShellCore.#portals[portalName];

    if (!portal) {
      throw new ReferenceError(
        `Unable to init portal with name: ${portalName}`
      );
    }

    // Save portal name in session storage
    sessionStorageEngine.setItem(
      KEY_SESSION_STORAGE_DEFAULT_PORTAL_NAME,
      portalName
    );

    this._activePortalName = portalName;

    // Wipe existing content
    document.body.innerHTML = "";

    // Wipe existing styling
    [...document.getElementsByTagName("style")].forEach(elStyle =>
      elStyle.parentNode.removeChild(elStyle)
    );

    this._elBase = document.createElement("div");
    document.body.appendChild(this._elBase);

    ReactDOM.render(
      <React.StrictMode>
        <Suspense fallback={<div />}>
          <BaseView portal={portal} />
        </Suspense>
      </React.StrictMode>,
      this._elBase
    );

    // TODO: Use LocalDataPersistentService sub-service to open any previously
    // closed windows and retain their window positions for this portal
    // @see https://developer.apple.com/design/human-interface-guidelines/macos/app-architecture/restoring-state/

    super._init();
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    // TODO: Shut down running apps first, and provide a way to cancel out of
    // shut-down in case we need to save any states

    // Stop the current UI
    ReactDOM.render(<div>[Tear down]</div>, this._elBase);

    await this._uiServiceCollection.destroy();

    // TODO: Unrender DOM

    const ret = super.destroy();

    // TODO: Refactor this handling into PhantomCore as optional single-instance (@see https://github.com/zenOSmosis/phantom-core/issues/72)
    _instance = null;

    return ret;
  }

  // TODO: Document
  getUIServiceCollection() {
    return this._uiServiceCollection;
  }

  // TODO: Document
  static getUIServiceCollection() {
    return _instance?.getUIServiceCollection();
  }

  // TODO: Document
  getPortalName() {
    return this._activePortalName;
  }

  // TODO: Document
  static getPortalName() {
    return _instance?.getPortalName();
  }
}

// Auto-init if query string
// TODO: Refactor
(() => {
  // IMPORTANT: This setTimeout (or any other async equiv.) is necessary to
  // allow the parsing of registerPortals.js before trying to run the init on
  // them
  //
  // TODO: Use nextTick / microtask / other async
  setTimeout(() => {
    const urlQuery = queryString.parse(window.location.search);

    const { portalName } = urlQuery;

    if (portalName) {
      ReShellCore.init(portalName);
    }
  });
})();
