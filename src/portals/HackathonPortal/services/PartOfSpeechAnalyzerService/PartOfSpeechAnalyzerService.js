// import {EVT_READY} from 'phantom-core'
import UIServiceCore from "@core/classes/UIServiceCore";

export default class PartOfSpeechAnalyzerService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Part of Speech Analyzer Service");

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
}
