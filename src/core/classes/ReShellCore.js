import "@core/startupHelpers";

import PhantomCore from "phantom-core";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";

import UIServiceManager from "../classes/UIServiceManager";
import KeyVaultService from "@services/KeyVaultService";
import LocalDeviceIdentificationService from "@services/LocalDeviceIdentificationService";

import BaseView from "../BaseView";

import queryString from "query-string";

import fetchIsLatestVersion from "@utils/fetchIsLatestVersion";

const KEY_SESSION_STORAGE_DEFAULT_PORTAL_NAME = "reshell-default-portal";

// TODO: Refactor this handling into PhantomCore as optional single-instance (@see https://github.com/zenOSmosis/phantom-core/issues/72)
let _instance = null;

/**
 * Handles bootstrapping the ReShell environment on the browser DOM and
 * establishes lifecycle control methods for the base ReShell environment.
 */
export default class ReShellCore extends PhantomCore {
  // TODO: Document
  static async forceUpdate() {
    if (_instance) {
      await _instance.destroy();
    }

    // TODO: Adjust as necessary
    window.location.href = `${
      process.env.PUBLIC_URL || ""
    }?__forceReboot=${new Date().getTime()}`;
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
        "UIServiceManager cannot have multiple instances"
      );
    }

    super({
      isAsync: true,
    });

    // TODO: Refactor this handling into PhantomCore as optional single-instance (@see https://github.com/zenOSmosis/phantom-core/issues/72)
    _instance = this;

    this._uiServiceManager = new UIServiceManager();
    this._uiServiceManager.startServiceClass(KeyVaultService);
    this._uiServiceManager.startServiceClass(LocalDeviceIdentificationService);

    // TODO: Bind window "beforeunload" event to try to prevent accidental shut
    // down before we have a chance to save states, etc. Ensure it gets unbound
    // before the destructor finishes.
    // @see https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload

    this._init(portalName);
  }

  // TODO: Document
  async _init(portalName) {
    const sessionStorageEngine = this._uiServiceManager
      .getServiceInstance(KeyVaultService)
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
    await sessionStorageEngine.setItem(
      KEY_SESSION_STORAGE_DEFAULT_PORTAL_NAME,
      portalName
    );

    // IMPORANT: This should come after setting of portal name in session storage
    // NOTE: Intentionally not awaiting this (though maybe we should)
    fetchIsLatestVersion().then(isLatest => {
      if (!isLatest) {
        if (
          // TODO: Update
          window.confirm(
            "It appears you are not running the latest version.  Reload?"
          )
        ) {
          ReShellCore.forceUpdate();
        }
      }
    });

    // Establish local device identity
    // TODO: Document why
    await (async () => {
      const localDeviceIdentificationService =
        this._uiServiceManager.getServiceInstance(
          LocalDeviceIdentificationService
        );

      const localIdentity =
        await localDeviceIdentificationService.fetchLocalIdentity();

      // TODO: Remove
      console.log({ localIdentity });
    })();

    this._activePortalName = portalName;

    // Wipe existing content, except for script tags (these script tags are
    // used by the fetchIsLatestVersion utility for comparsion purposes)
    [...document.body.children].forEach(child => {
      if (child.tagName.toUpperCase() !== "SCRIPT") {
        child.parentNode.removeChild(child);
      }
    });

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

    // TODO: Use KeyVaultService sub-service to open any previously
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

    // Unrender DOM
    // Stop the current UI
    ReactDOM.render(<div>[Tear down]</div>, this._elBase);

    await this._uiServiceManager.destroy();

    const ret = await super.destroy();

    // TODO: Refactor this handling into PhantomCore as optional single-instance (@see https://github.com/zenOSmosis/phantom-core/issues/72)
    _instance = null;

    return ret;
  }

  // TODO: Document
  static async destroy() {
    return _instance?.destroy();
  }

  // TODO: Document
  static async reload() {
    await _instance?.destroy();

    window.location.reload();
  }

  // TODO: Document
  async switchToPortal(portalName) {
    const sessionStorageEngine = this._uiServiceManager
      .getServiceInstance(KeyVaultService)
      .getSessionStorageEngine();

    // Cache portalName to the session storage
    await sessionStorageEngine.setItem(
      KEY_SESSION_STORAGE_DEFAULT_PORTAL_NAME,
      portalName
    );

    await this.destroy();

    const urlQuery = queryString.stringify({ portalName });

    window.location.href = `${process.env.PUBLIC_URL || ""}?${urlQuery}`;
  }

  // TODO: Document
  static async switchToPortal(portalName) {
    await _instance?.switchToPortal(portalName);
  }

  // TODO: Document
  getUIServiceManager() {
    return this._uiServiceManager;
  }

  // TODO: Document
  static getUIServiceManager() {
    return _instance?.getUIServiceManager();
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
