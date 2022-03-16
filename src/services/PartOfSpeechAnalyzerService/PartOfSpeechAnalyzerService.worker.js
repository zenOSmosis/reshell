import { EVT_READY } from "phantom-core";
import nlp from "compromise";

// TODO: Refactor accordingly
global.postMessage({
  eventName: EVT_READY,
});

/**
 * TODO: Some documentation:
 *
 * - https://www.npmjs.com/package/compromise
 * - https://observablehq.com/@spencermountain/compromise-internals?collection=@spencermountain/nlp-compromise
 * - https://www.npmjs.com/package/worker-plugin
 */

// TODO: Implement accordingly
let doc = nlp("she sells seashells by the seashore.");
doc.verbs().toPastTense();

// TODO: Remove
console.log({
  verbs: doc.verbs().json(),
});
