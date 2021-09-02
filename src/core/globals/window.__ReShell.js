import React, { Suspense } from "react";
import ReactDOM from "react-dom";

import BaseView from "../BaseView";

// TODO: Extend PhantomCore and unrender on destruct?
export default class DOMReShell {
  // TODO: Document
  static async beforeDOMReplace() {}

  // TODO: Document
  static async afterDOMReplace() {}

  // TODO: Document
  static async initDOM(baseApp = null) {
    if (!baseApp) {
      switch (process.env.REACT_APP_PORTAL) {
        case "setupwizard":
          baseApp = React.lazy(() => import("../../WizardApp"));
          break;

        default:
          baseApp = React.lazy(() => import("../../ExampleApp"));
      }
    }

    await DOMReShell.beforeDOMReplace();

    // Wipe existing content
    document.body.innerHTML = "";

    // Wipe existing styling
    [...document.getElementsByTagName("style")].forEach((elStyle) =>
      elStyle.parentNode.removeChild(elStyle)
    );

    const elBase = document.createElement("div");
    document.body.appendChild(elBase);

    ReactDOM.render(
      <React.StrictMode>
        <Suspense fallback={<div />}>
          <BaseView baseApp={baseApp} />
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
