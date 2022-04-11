import nlp from "compromise";

import { registerRPCMethod } from "@utils/classes/RPCPhantomWorker/worker";

import { retext } from "retext";
import { inspect } from "unist-util-inspect";
import retextPos from "retext-pos";

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
  // doc.verbs().toFutureTense();

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
registerRPCMethod("applyTransformations", ({ text, transformations = {} }) => {
  let doc = nlp(text);

  if (transformations.nouns?.toPlural) {
    doc.nouns().toPlural();
  }

  if (transformations.nouns?.toSingular) {
    doc.nouns().toSingular();
  }

  if (transformations.verbs?.toPastTense) {
    doc.verbs().toPastTense();
  }

  if (transformations.verbs?.toFutureTense) {
    doc.verbs().toFutureTense();
  }

  doc.normalize();

  return doc.text();
});

registerRPCMethod("fetchSyntaxTree", ({ text }) => {
  return new Promise(resolve => {
    retext()
      .use(retextPos)
      .use(() => tree => {
        resolve(inspect(tree));
      })
      .process(text);
  });
});

// @see https://observablehq.com/@spencermountain/nouns
registerRPCMethod("fetchNouns", ({ text }) => {
  let doc = nlp(text);

  const nouns = [...new Set(doc.nouns().out("array"))];

  return nouns;
});

// @see https://observablehq.com/@spencermountain/verbs
registerRPCMethod("fetchVerbs", ({ text }) => {
  let doc = nlp(text);

  const verbs = [...new Set(doc.verbs().out("array"))];

  return verbs;
});
