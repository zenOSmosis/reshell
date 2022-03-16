// import {EVT_READY} from 'phantom-core'
import UIServiceCore from "@core/classes/UIServiceCore";

export default class PartOfSpeechAnalyzerService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Part of Speech Analyzer Service");

    // TODO: Implement accordingly
    // @see https://www.npmjs.com/package/worker-plugin
    this._worker = new Worker("./PartOfSpeechAnalyzerService.worker", {
      type: "module",
    });
    this._worker.onmessage = evt => {
      // TODO: Listen for remote READY event before trying to continue

      console.log("received message event", evt);
    };
  }
}
