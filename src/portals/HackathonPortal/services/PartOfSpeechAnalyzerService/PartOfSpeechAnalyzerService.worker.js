import { EVT_READY } from "phantom-core";
import nlp from "compromise";

// TODO: Also look into https://www.npmjs.com/package/retext

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

function analyze({ text }) {
  // TODO: Implement accordingly
  let doc = nlp(text);
  doc.verbs().toPastTense();

  // TODO: Remove
  console.log({
    verbs: doc.verbs().json(),
    // syllables: doc.syllables().json(),
    nouns: doc.nouns().json(),
    // pronouns: doc.pronouns.json(),
    // prepositions: doc.prepositions.json(),
    doc: doc.json(),
  });
}

global.addEventListener("message", evt => {
  const { method, params } = evt.data;

  // TODO: Remove
  console.log({ method, params });

  switch (method) {
    case "analyze":
      analyze(params);
      break;

    default:
      break;
  }
});
