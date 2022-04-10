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

// TODO: Remove?
registerRPCMethod("analyze", ({ text }) => {
  // TODO: Implement accordingly
  let doc = nlp(text);

  // doc.verbs().toPastTense();
  doc.verbs().toFutureTense();

  // TODO: Remove
  console.log(doc);

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

// @see https://observablehq.com/@spencermountain/nouns
registerRPCMethod("applyModifiers", ({ text, modifiers = {} }) => {
  let doc = nlp(text);

  if (modifiers.nouns?.toPlural) {
    doc.nouns().toPlural();
  }

  if (modifiers.nouns?.toSingular) {
    doc.nouns().toSingular();
  }

  if (modifiers.verbs?.toPastTense) {
    doc.verbs().toPastTense();
  }

  if (modifiers.verbs?.toFutureTense) {
    doc.verbs().toFutureTense();
  }

  return doc
    .json()
    .map(el => el.text)
    .join(" ");
});
