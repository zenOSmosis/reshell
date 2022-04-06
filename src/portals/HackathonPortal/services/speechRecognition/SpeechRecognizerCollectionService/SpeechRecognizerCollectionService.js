import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";
import SpeechRecognizerServiceCollection from "./SpeechRecognizerServiceCollection";

import {
  EVT_REAL_TIME_TRANSCRIPTION,
  EVT_FINALIZED_TRANSCRIPTION,
} from "../__common__/SpeechRecognizerBase";

import MesaSpeechRecognizerService from "../provider/Mesa/MesaSpeechRecognizerService";
import DeepgramSpeechRecognizerService from "../provider/Deepgram/DeepgramSpeechRecognizerService";

export {
  EVT_UPDATED,
  EVT_REAL_TIME_TRANSCRIPTION,
  EVT_FINALIZED_TRANSCRIPTION,
};

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

    this.setState({
      realTimeTranscription: null,
      finalizedTranscription: null,
      // hasRecognizer: false,
    });

    /** @type {SpeechRecognizerServiceCollection} */
    this._speechRecognizerServiceCollection = this.bindCollectionClass(
      SpeechRecognizerServiceCollection
    );

    // Handle speech events
    [EVT_REAL_TIME_TRANSCRIPTION, EVT_FINALIZED_TRANSCRIPTION].forEach(evt => {
      this.proxyOn(
        this._speechRecognizerServiceCollection,
        evt,
        ([service, text]) => {
          // Proxy event
          this.emit(evt, [service, text]);

          // Route event to local state
          switch (evt) {
            case EVT_REAL_TIME_TRANSCRIPTION:
              this.setState({ realTimeTranscription: text });
              break;

            case EVT_FINALIZED_TRANSCRIPTION:
              this.setState({ finalizedTranscription: text });
              break;

            default:
              break;
          }
        }
      );
    });

    // Set up our speech recognizers
    this.useSpeechRecognizerServiceClass(MesaSpeechRecognizerService);
    this.useSpeechRecognizerServiceClass(DeepgramSpeechRecognizerService);
  }

  /**
   * @param {SpeechRecognizerServiceClass} SpeechRecognizerServiceClass
   * @return {void}
   */
  useSpeechRecognizerServiceClass(SpeechRecognizerServiceClass) {
    // TODO: Check for class instance before using
    // (partially relates to: https://github.com/zenOSmosis/phantom-core/issues/155)

    /** @type {SpeechRecognizerServiceClass} */
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
   * @return {SpeechRecognizerServiceCore[]}
   */
  getSpeechRecognizerServices() {
    return this._speechRecognizerServiceCollection.getChildren();
  }

  /**
   * Retrieves whether or not a speech recognizer is currently connected.
   *
   * @return {boolean}
   */
  getHasRecognizer() {
    return this._speechRecognizerServiceCollection.getHasRecognizer();
  }

  /**
   * Retrieves the non-finalized speech transcription.
   *
   * NOTE: This will emit much faster than the finalized transcription and may
   * automatically correct itself as words are spoken.
   *
   * @return {string | null}
   */
  getRealTimeTranscription() {
    return this.getState().realTimeTranscription;
  }

  /**
   * Retrieves the last finalized transcription received.
   *
   * @return {string | null}
   */
  getFinalizedTranscription() {
    return this.getState().finalizedTranscription;
  }
}
