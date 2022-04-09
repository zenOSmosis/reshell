import nlp from "compromise";
import { registerRPCMethod } from "@utils/classes/RPCPhantomWorker/worker";

// TODO: Also look into https://www.npmjs.com/package/retext

/**
 * TODO: Some documentation:
 *
 * - https://www.npmjs.com/package/compromise
 * - https://observablehq.com/@spencermountain/compromise-internals?collection=@spencermountain/nlp-compromise
 * - https://www.npmjs.com/package/worker-plugin
 */

registerRPCMethod("analyze", ({ text }) => {
  // TODO: Implement accordingly
  let doc = nlp(text);
  doc.verbs().toPastTense();

  // TODO: Remove
  return {
    verbs: doc.verbs().json(),
    // syllables: doc.syllables().json(),
    nouns: doc.nouns().json(),
    // pronouns: doc.pronouns.json(),
    // prepositions: doc.prepositions.json(),
    doc: doc.json(),
  };
});
