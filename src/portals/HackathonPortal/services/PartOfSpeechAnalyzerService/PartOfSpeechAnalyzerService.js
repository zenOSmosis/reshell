import UIServiceCore from "@core/classes/UIServiceCore";
import RPCPhantomWorker from "@utils/classes/RPCPhantomWorker/main";

// TODO: Rename
// TODO: Document
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

  // TODO: Document
  async fetchSyntaxTree(text) {
    return this._rpcWorker.call("fetchSyntaxTree", { text });
  }

  // TODO: Document
  async fetchPartsOfSpeech(text) {
    return this._rpcWorker.call("fetchPartsOfSpeech", { text });
  }

  // TODO: Document
  async fetchPolarity(text) {
    return this._rpcWorker.call("fetchPolarity", { text });
  }

  // TODO: Document
  async fetchSentimentAnalysis(text) {
    return this._rpcWorker.call("fetchSentimentAnalysis", { text });
  }

  // TODO: Document
  async fetchRandomizedTemplate(text) {
    return this._rpcWorker.call("fetchRandomizedTemplate", { text });
  }
}
