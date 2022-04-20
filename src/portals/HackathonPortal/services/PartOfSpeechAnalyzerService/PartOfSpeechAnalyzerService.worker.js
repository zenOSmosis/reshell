// NOTE: This currently only works with the English language

// - https://github.com/kylestetz/Sentencer

// FIXME: (jh) Utilize internal caching

import { registerRPCMethod } from "@utils/classes/RPCPhantomWorker/worker";
import retextStringify from "retext-stringify";
import retextPos from "retext-pos";
import { unified } from "unified";
import retextEnglish from "retext-english";
import { inspect } from "unist-util-inspect";
import { visit } from "unist-util-visit";
import { polarity } from "polarity";

import partOfSpeechTags from "./partOfSpeechTags";
import sentiments from "./sentiments";

// Note: "FakeWindow" is needed to patch randy library in Sentencer
// Related issue: https://github.com/kylestetz/Sentencer/issues/28
import "./FakeWindow";
import Sentencer from "sentencer";

// TODO: Document
async function fetchSyntaxTree(text, outputProcessor = inspect) {
  return new Promise(resolve => {
    unified()
      // TODO: Make the language dynamic
      .use(retextEnglish)

      .use(retextStringify)
      .use(retextPos)
      .use(() => tree => {
        if (outputProcessor) {
          resolve(outputProcessor(tree));
        } else {
          // nlcst syntax tree https://github.com/syntax-tree/nlcst
          resolve(tree);
        }
      })
      .process(text);
  });
}

registerRPCMethod("fetchSyntaxTree", ({ text }) => fetchSyntaxTree(text));

// TODO: Document
async function fetchPartsOfSpeech(text) {
  const syntaxTree = await fetchSyntaxTree(text, null);

  const partsOfSpeech = [];

  visit(syntaxTree, node => {
    if (node.type === "WordNode") {
      const { partOfSpeech } = node.data;
      const word = node.children[0].value;
      partsOfSpeech.push({
        word,
        partOfSpeech: {
          tag: partOfSpeech,
          description: partOfSpeechTags[partOfSpeech],
        },
      });
    }
  });

  return partsOfSpeech;
}

registerRPCMethod("fetchPartsOfSpeech", ({ text }) => fetchPartsOfSpeech(text));

// TODO: Document
async function fetchPolarity(text) {
  const words = await fetchWords(text);

  return polarity(words);
}

registerRPCMethod("fetchPolarity", ({ text }) => fetchPolarity(text));

// TODO: Document
async function fetchSentimentAnalysis(text) {
  const polarity = await fetchPolarity(text);

  const polePercent = (polarity.polarity + 10) * 5;

  const lenSentiments = sentiments.length;

  let idx = Math.floor(lenSentiments * (polePercent / 100));

  // Keep idx within constraints
  if (idx < 0) {
    idx = 0;
  }
  if (idx >= lenSentiments) {
    idx = lenSentiments - 1;
  }

  return sentiments[idx];
}

registerRPCMethod("fetchSentimentAnalysis", ({ text }) =>
  fetchSentimentAnalysis(text)
);

// TODO: Document
async function fetchWords(text) {
  const syntaxTree = await fetchSyntaxTree(text, null);

  const words = [];

  visit(syntaxTree, node => {
    if (node.type === "WordNode") {
      const word = node.children[0].value;
      words.push(word);
    }
  });

  return words;
}

registerRPCMethod("fetchWords", ({ text }) => fetchWords(text));

// TODO: Finish implementing
// TODO: Document
async function fetchRandomizedTemplate(text) {
  const syntaxTree = await fetchSyntaxTree(text, null);

  const tokens = [];

  let determiner = null;

  visit(syntaxTree, node => {
    if (node.type === "WordNode") {
      const { partOfSpeech } = node.data;

      switch (partOfSpeech) {
        // Note: Some of the following conditions might be technically
        // incorrect for this, but help to give more results
        case "NN": // Noun, singular
        case "NNS": // Noun, plural
        case "MD": // Modal
        case "VBN": // Verb, past participle (i.e. "weed")
          // Automatically handle vowels / consonants
          if (determiner) {
            tokens.push("{{ a_noun }}");
          } else {
            tokens.push("{{ noun }}");
          }

          determiner = null;

          break;

        case "JJ":
          // Automatically handle vowels / consonants
          if (determiner) {
            tokens.push("{{ an_adjective }}");
          } else {
            tokens.push("{{ adjective }}");
          }

          determiner = null;

          break;

        default:
          // If determiner wasn't used in noun / adjective, re-add it to the
          // sentence
          if (determiner) {
            tokens.push(determiner);
            tokens.push(" ");
            determiner = null;
          }

          const word = node.children[0].value;

          // Note: This would only work w/ English
          if (["a", "an"].includes(word.toLowerCase())) {
            determiner = word;
          } else {
            tokens.push(word);
          }

          break;
      }
    } else if (node.type === "ParagraphNode" && tokens.length) {
      tokens.push("\n\n");
    } else if (["WhiteSpaceNode", "PunctuationNode"].includes(node.type)) {
      tokens.push(node.value);
    }
  });

  return Sentencer.make(tokens.join(""))
    .trim()
    .split("")
    .map((char, idx) => (idx === 0 ? char.toUpperCase() : char))
    .join("")
    .replaceAll("  ", " ");
}

registerRPCMethod("fetchRandomizedTemplate", ({ text }) =>
  fetchRandomizedTemplate(text)
);
