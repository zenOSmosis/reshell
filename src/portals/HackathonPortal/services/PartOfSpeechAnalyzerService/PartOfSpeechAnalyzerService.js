import UIServiceCore from "@core/classes/UIServiceCore";
import RPCPhantomWorker from "@root/src/utils/classes/RPCPhantomWorker/main";

export default class PartOfSpeechAnalyzerService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Part of Speech Analyzer Service");

    // FIXME: (jh) Implement direct worker support w/ UIService?
    this._rpcWorker = new RPCPhantomWorker(
      () =>
        new Worker("./PartOfSpeechAnalyzerService.worker", { type: "module" })
    );

    // Terminate worker when service destructs
    this.registerCleanupHandler(() => this._rpcWorker.destroy());
  }

  // TODO: Handle
  async analyze(text) {
    const result = await this._rpcWorker.call("analyze", { text });

    // TODO: Handle
    console.log({ result });
  }

  /**
   * Applies one or more transformations to the given text.
   *
   * @param {string} text
   * @param {Object} transformations // TODO: Document
   * @return {Promise<string>}
   */
  async applyTransformations(text, transformations) {
    const outputText = await this._rpcWorker.call("applyTransformations", {
      text,
      transformations,
    });

    return outputText;
  }

  // TODO: Document
  async fetchSyntaxTree(text) {
    const syntaxTree = await this._rpcWorker.call("fetchSyntaxTree", { text });

    return syntaxTree;
  }

  // TODO: Document
  async fetchNouns(text) {
    const nouns = await this._rpcWorker.call("fetchNouns", { text });

    return nouns;
  }

  // TODO: Document
  async fetchVerbs(text) {
    const verbs = await this._rpcWorker.call("fetchVerbs", { text });

    return verbs;
  }
}
