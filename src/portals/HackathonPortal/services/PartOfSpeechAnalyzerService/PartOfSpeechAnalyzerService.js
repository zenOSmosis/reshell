// import {EVT_READY} from 'phantom-core'
import UIServiceCore from "@core/classes/UIServiceCore";
import RPCPhantomWorker from "@root/src/utils/classes/RPCPhantomWorker/main";

export default class PartOfSpeechAnalyzerService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Part of Speech Analyzer Service");

    // TODO: Implement accordingly
    //
    // TODO: Check for worker feature detection before trying to use: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#worker_feature_detection
    //
    // TODO: Implement direct worker support w/ UIService?
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
   * @param {string} text
   * @param {Object} transformations // TODO: Document
   * @returns
   */
  async applyTransformations(text, transformations) {
    const outputText = await this._rpcWorker.call("applyTransformations", {
      text,
      transformations,
    });

    return outputText;
  }
}
