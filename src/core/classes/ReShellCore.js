import React, { Suspense } from "react";
import ReactDOM from "react-dom";

import BaseView from "../BaseView";

import queryString from "query-string";

// TODO: Move class to classes, and expose via globals directory
// TODO: Extend PhantomCore and unrender on destruct?
export default class ReShellCore {
  // TODO: Document
  static async beforeDOMReplace() {}

  // TODO: Document
  static async afterDOMReplace() {}

  // TODO: Document
  static #portals = {};

  // TODO: Document
  static #activePortalName = null;

  // TODO: Document
  static getPortalName() {
    return this.#activePortalName;
  }

  // TODO: Document
  static registerPortals(portals) {
    ReShellCore.#portals = portals;
  }

  // TODO: Document
  static getPortals() {
    return ReShellCore.#portals;
  }

  static #isReShellDOMInitStarted = false;

  // TODO: Document
  static async init(portalName = "default") {
    if (ReShellCore.#isReShellDOMInitStarted) {
      return ReShellCore.switchToPortal(portalName);
    }

    ReShellCore.#isReShellDOMInitStarted = true;

    const portal = ReShellCore.#portals[portalName];

    if (!portal) {
      throw new ReferenceError(
        `Unable to init portal with name: ${portalName}`
      );
    } else {
      ReShellCore.#activePortalName = portalName;
    }

    await ReShellCore.beforeDOMReplace();

    // Wipe existing content
    document.body.innerHTML = "";

    // Wipe existing styling
    [...document.getElementsByTagName("style")].forEach(elStyle =>
      elStyle.parentNode.removeChild(elStyle)
    );

    const elBase = document.createElement("div");
    document.body.appendChild(elBase);

    ReactDOM.render(
      <React.StrictMode>
        <Suspense fallback={<div />}>
          <BaseView portal={portal} />
        </Suspense>
      </React.StrictMode>,
      elBase
    );

    await ReShellCore.afterDOMReplace();
  }

  // TODO: Document
  static async switchToPortal(portalName) {
    if (!ReShellCore.#isReShellDOMInitStarted) {
      return ReShellCore.init(portalName);
    }

    // TODO: Animate existing DOM out

    const urlQuery = queryString.stringify({ portalName });

    window.location.href = `?${urlQuery}`;
  }
}

// Auto-init if query string
(() => {
  // IMPORTANT: This setTimeout (or any other async equiv.) is necessary to
  // allow the parsing of registerPortals.js before trying to run the init on
  // them
  setTimeout(() => {
    const urlQuery = queryString.parse(window.location.search);

    const { portalName } = urlQuery;

    if (portalName) {
      ReShellCore.init(portalName);
    }
  });
})();
