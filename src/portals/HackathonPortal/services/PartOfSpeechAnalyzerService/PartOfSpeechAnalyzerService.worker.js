// TODO: Integrate
// - https://github.com/kylestetz/Sentencer

import { registerRPCMethod } from "@utils/classes/RPCPhantomWorker/worker";
import retextStringify from "retext-stringify";
import retextPos from "retext-pos";
import { unified } from "unified";
import retextEnglish from "retext-english";
import { inspect } from "unist-util-inspect";
import { visit } from "unist-util-visit";
import partOfSpeechTags from "./partOfSpeechTags";

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
