import PhantomCore, { EVT_BEFORE_DESTROY, EVT_DESTROYED } from "phantom-core";

const sdk = require("microsoft-cognitiveservices-speech-sdk");

export const EVT_BEGIN_RECOGNIZE = "begin-recognize";
export const EVT_END_RECOGNIZE = "end-recognize";

// Emits with the current text being recognized
export const EVT_TRANSCRIPTION_RECOGNIZING = "transcription-recognizing";

// TODO: Document that this emits with text
export const EVT_TRANSCRIPTION_FINALIZED = "transcription-finalized";

export { EVT_BEFORE_DESTROY, EVT_DESTROYED };

// Examples:
// https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/javascript/browser/from-microphone

/**
 * Handles direct communication with Azure CognitiveService backend using the
 * microsoft-cognitiveservices-speech-sdk.
 *
 * Interfaces with npm library:
 * @see {@link https://www.npmjs.com/package/microsoft-cognitiveservices-speech-sdk}ß
 */
export default class MesaSpeechRecognizer extends PhantomCore {
  /**
   * @param {MediaStream} mediaStream
   * @param {string} subscriptionKey
   * @param {Object} options? [default = {}]
   */
  constructor(mediaStream, subscriptionKey, options) {
    super(options);

    this._isRecognizing = false;
    this._isRecognized = false;

    this._subscriptionKey = subscriptionKey;

    // TODO: Replace hardcoding with config param
    this._locationRegion = "eastus";
    this._speechRecognitionLanguage = "en-US";

    this._mediaStream = mediaStream;

    // Automatically start recognizing
    this._startRecognizing();
  }

  /**
   * Retrieves the Mesa cloud service location region this recognizer is
   * associated with.
   *
   * @return {string}
   */
  getLocationRegion() {
    return this._locationRegion;
  }

  /**
   * Retrieves the Mesa language code for this recognizer.
   *
   * @return {string}
   */
  getRecognitionLanguage() {
    return this._recognitionLanguage;
  }

  /**
   * Sets whether or not the speech is currently being recognized.
   *
   * @param {boolean} isRecognizing
   * @emits EVT_BEGIN_RECOGNIZE
   * @emits EVT_END_RECOGNIZE
   * @return {void}
   */
  _setIsRecognizing(isRecognizing) {
    this._isRecognizing = isRecognizing;

    if (isRecognizing) {
      this.emit(EVT_BEGIN_RECOGNIZE);
    } else {
      this.emit(EVT_END_RECOGNIZE);
    }
  }

  /**
   * Sets the finalized speech transcription.
   *
   * @param {string} text
   * @emits EVT_TRANSCRIPTION_FINALIZED
   * @return {void}
   */
  _setFinalizedTranscription(text) {
    this._setIsRecognizing(false);

    this.emit(EVT_TRANSCRIPTION_FINALIZED, text);
  }

  // TODO: Ensure this instance is automatically destructed if the speech
  // service errors or has a network error
  /**
   * Starts the speech recognition processing, performs remote event binding to
   * the class instance, and handles cleanup operations.
   *
   * @return {void}
   */
  _startRecognizing() {
    const stream = this._mediaStream;

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      this._subscriptionKey,
      this._locationRegion
    );

    speechConfig.speechRecognitionLanguage = this._speechRecognitionLanguage;

    let audioConfig = sdk.AudioConfig.fromStreamInput(stream);

    // TODO: Make this a class property
    let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    // Stop recognizer before destruct cleanup happens
    this.once(EVT_BEFORE_DESTROY, () => {
      recognizer.stopContinuousRecognitionAsync();

      recognizer.close();
    });

    // TODO: Ensure this automatically stops when the input stops or after a
    // certain amount of time
    //
    // TODO: Refactor
    (() => {
      recognizer.recognizing = (s, e) => {
        this._setIsRecognizing(true);

        // TODO: Change to debug
        console.log(`RECOGNIZING: Text=${e.result.text}`);

        this.emit(EVT_TRANSCRIPTION_RECOGNIZING, e.result.text);
      };

      recognizer.recognized = (s, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
          this._setFinalizedTranscription(e.result.text);

          // TODO: Change to debug
          console.log(`RECOGNIZED: Text=${e.result.text}`);
        } else if (e.result.reason === sdk.ResultReason.NoMatch) {
          this._setIsRecognizing(false);

          // TODO: Change to debug
          console.log("NOMATCH: Speech could not be recognized.");
        }
      };

      recognizer.canceled = async (s, e) => {
        this._setIsRecognizing(false);

        // TODO: Change to debug
        console.log(`CANCELED: Reason=${e.reason}`);

        if (e.reason === sdk.CancellationReason.Error) {
          // TODO: Change to debug
          console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
          console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
          console.log(
            "CANCELED: Did you update the key and location/region info?"
          );
        }

        // NOTE: This should be automatically stopped by the following
        // operation, but as double insurance, let's stop it here
        recognizer.stopContinuousRecognitionAsync();

        // We can't do anything about cancellations, so just destruct the
        // instance
        return this.destroy();
      };

      recognizer.sessionStopped = (s, e) => {
        this._setIsRecognizing(false);

        // TODO: Change to debug
        console.log("\n    Session stopped event.");
        recognizer.stopContinuousRecognitionAsync();
      };

      // Start recognizing
      recognizer.startContinuousRecognitionAsync();
    })();
  }
}
