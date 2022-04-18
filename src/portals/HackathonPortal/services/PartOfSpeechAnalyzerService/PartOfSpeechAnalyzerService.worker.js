// TODO: Integrate
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
