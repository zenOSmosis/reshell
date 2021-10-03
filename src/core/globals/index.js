/**
 * Everything in this directory is intended to be exposed as a window global.
 *
 * This makes it possible to bind ReShell directly to underlying HTML page
 * before it initializes, where buttons on the page can start the React DOM
 * servicing (instead of default automatic).
 */

import "./window.ReShell.js";
