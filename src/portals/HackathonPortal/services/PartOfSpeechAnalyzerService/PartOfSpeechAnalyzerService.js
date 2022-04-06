// import {EVT_READY} from 'phantom-core'
import UIServiceCore from "@core/classes/UIServiceCore";
import RPCWorker from "@root/src/utils/classes/RPCWorker/RPCWorker.main";
import RCPWorker from "@utils/classes/RPCWorker/RPCWorker.main";

export default class PartOfSpeechAnalyzerService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Part of Speech Analyzer Service");

    // TODO: Handle accordingly
    this._rpcWorker = new RPCWorker();
    this._rpcWorker.call({ method: "test", params: {} });

    // TODO: Implement accordingly
    //
    // TODO: Check for worker feature detection before trying to use: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#worker_feature_detection
    //
    // @see https://www.npmjs.com/package/worker-plugin
    this._worker = new Worker("./PartOfSpeechAnalyzerService.worker", {
      // IMPORTANT: Use of "module" is important here
      type: "module",
    });
    this._worker.onmessage = evt => {
      // TODO: Listen for remote READY event before trying to continue

      console.log("received message event", evt);
    };

    // TODO: Terminate worker once this class destructs: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#terminating_a_worker
  }

  async analyze(text) {
    this._worker.postMessage({ method: "analyze", params: { text } });
  }
}
