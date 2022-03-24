import SpeechRecognizerBase, {
  EVT_BEFORE_DESTROY,
  EVT_DESTROYED,
} from "../../../__common__/SpeechRecognizerBase";

import { Deepgram } from "@deepgram/sdk";

export const EVT_CONNECTING = "connecting";
export const EVT_CONNECTED = "connected";

export const EVT_BEGIN_RECOGNIZE = "begin-recognize";
export const EVT_END_RECOGNIZE = "end-recognize";

// Emits with the current text being recognized
export const EVT_TRANSCRIPTION_RECOGNIZING = "transcription-recognizing";

// TODO: Document that this emits with text
export const EVT_TRANSCRIPTION_FINALIZED = "transcription-finalized";

export { EVT_BEFORE_DESTROY, EVT_DESTROYED };

// Examples:
// https://github.com/deepgram/deepgram-node-sdk#transcribe-audio-in-real-time

/**
 * @see https://deepgram.com/
 */
export default class DeepgramSpeechRecognizer extends SpeechRecognizerBase {
  /**
   * @param {MediaStream} mediaStream
   * @param {string} apiKey
   * @param {Object} options? [default = {}]
   */
  constructor(mediaStream, apiKey, options) {
    super(mediaStream, options);

    // this._subscriptionKey = subscriptionKey;

    // TODO: Replace hardcoding with config param
    // this._locationRegion = "eastus";
    // this._speechRecognitionLanguage = "en-US";
  }

  /**
   * Retrieves the Mesa language code for this recognizer.
   *
   * @return {string}
   */
  /*
  getRecognitionLanguage() {
    return this._recognitionLanguage;
  }
  */

  // TODO: Ensure this instance is automatically destructed if the speech
  // service errors or has a network error
  /**
   * Starts the speech recognition processing, performs remote event binding to
   * the class instance, and handles cleanup operations.
   *
   * @return {void}
   */
  _startRecognizing() {
    throw new Error("TODO: Implement");
  }
}
