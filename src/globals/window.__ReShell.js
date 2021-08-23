import React from "react";
import ReactDOM from "react-dom";

import BaseView from "../components/core/BaseView";
import ExampleApp from "../ExampleApp";

export default class DOMReShell {
  // TODO: Document
  static async beforeDOMReplace() {}

  // TODO: Document
  static async afterDOMReplace() {}

  // TODO: Document
  static async initDOM(BaseApp = ExampleApp) {
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
        <BaseView BaseApp={BaseApp} />
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
