import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";
import SpeechRecognizerServiceCollection from "./SpeechRecognizerServiceCollection";

import { EVT_TRANSCRIPTION_FINALIZED } from "../__common__/SpeechRecognizerBase";

import MesaSpeechRecognizerService from "../vendor/Mesa/MesaSpeechRecognizerService";
// TODO: Enable
// import DeepgramSpeechRecognizerService from "../vendor/Deepgram/DeepgramSpeechRecognizerService";

export { EVT_UPDATED, EVT_TRANSCRIPTION_FINALIZED };

/**
 * Maintains a collection of speech recognizer services.
 */
export default class SpeechRecognizerCollectionService extends UIServiceCore {
  // TODO: Enforce non-extendable
  // @see https://github.com/zenOSmosis/phantom-core/issues/149
  /*
  static meta = {
    extendable: false,
  };
  */

  constructor(...args) {
    super(...args);

    this.setTitle("Speech Recognizer Collection Service");

    this._speechRecognizerServiceCollection = this.bindCollectionClass(
      SpeechRecognizerServiceCollection
    );

    // NOTE: This does not currently facilitate dynamically adding / removing
    // speech recognizer services
    //
    // Proxy _speechRecognizerCollection EVT_TRANSCRIPTION_FINALIZED
    this.proxyOn(
      this._speechRecognizerServiceCollection,
      EVT_TRANSCRIPTION_FINALIZED,
      text => this.emit(EVT_TRANSCRIPTION_FINALIZED, text)
    );

    this.useSpeechRecognizerServiceClass(MesaSpeechRecognizerService);

    // TODO: Enable
    // this.useSpeechRecognizerServiceClass(DeepgramSpeechRecognizerService)
  }

  /**
   *
   * @param {*} SpeechRecognizerServiceClass
   */
  useSpeechRecognizerServiceClass(SpeechRecognizerServiceClass) {
    // TODO: Check for class instance before
    const speechRecognizerServiceInstance = this.useServiceClass(
      SpeechRecognizerServiceClass
    );

    this._speechRecognizerServiceCollection.addSpeechRecognizerServiceInstance(
      speechRecognizerServiceInstance
    );
  }

  /**
   * Retrieves the speech recognizer service instances which are bound to this
   * service.
   *
   * @return {SpeechRecognizerServiceBase[]}
   */
  getSpeechRecognizerServices() {
    return this.getChildren();
  }
}
