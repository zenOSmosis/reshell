import React, { Suspense } from "react";
import ReactDOM from "react-dom";

import BaseView from "../BaseView";

// TODO: Move class to classes, and expose via globals directory
// TODO: Extend PhantomCore and unrender on destruct?
export default class DOMReShell {
  // TODO: Document
  static async beforeDOMReplace() {}

  // TODO: Document
  static async afterDOMReplace() {}

  // TODO: Document
  static async initDOM(portal = null) {
    if (!portal) {
      switch (process.env.REACT_APP_PORTAL) {
        case "test":
          portal = React.lazy(() => import("@portals/TestPortal"));
          break;

        default:
          portal = React.lazy(() => import("@portals/ExamplePortal"));
      }
    }

    await DOMReShell.beforeDOMReplace();

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

    await DOMReShell.afterDOMReplace();
  }
}

/**
 * @global
 */
window.__ReShell = DOMReShell;
