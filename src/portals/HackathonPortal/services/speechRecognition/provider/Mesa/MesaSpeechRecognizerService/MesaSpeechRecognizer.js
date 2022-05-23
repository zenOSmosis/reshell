import SpeechRecognizerBase from "../../../__common__/SpeechRecognizerBase";

const sdk = require("microsoft-cognitiveservices-speech-sdk");

// disable telemetry data
sdk.Recognizer.enableTelemetry(false);

/**
 * Handles direct communication with Azure CognitiveService backend using the
 * microsoft-cognitiveservices-speech-sdk.
 *
 * Interfaces with npm library:
 * @see {@link https://www.npmjs.com/package/microsoft-cognitiveservices-speech-sdk}
 */
export default class MesaSpeechRecognizer extends SpeechRecognizerBase {
  /**
   * @param {MediaStream} mediaStream
   * @param {string} subscriptionKey
   * @param {Object} options? [default = {}]
   */
  constructor(mediaStream, subscriptionKey, options) {
    super(mediaStream, options);

    this._subscriptionKey = subscriptionKey;

    // TODO: Replace hardcoding with config param
    this._locationRegion = "eastus";
    this._speechRecognitionLanguage = "en-US";

    this._recognizer = null;
    this.registerCleanupHandler(() => this._stopRecognizing());
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
   * @return {Promise<void>}
   */
  async _stopRecognizing() {
    if (this._recognizer) {
      this._recognizer.stopContinuousRecognitionAsync();

      this._recognizer.close();

      this._recognizer = null;
    }
  }

  /**
   * Starts the speech recognition processing, performs remote event binding to
   * the class instance, and handles cleanup operations.
   *
   * Based on the example:
   * @see  https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/javascript/browser/from-microphone
   *
   * @return {Promise<void>}
   */
  async _startRecognizing() {
    if (this._recognizer) {
      await this._stopRecognizing();
    }

    this._setIsConnecting(true);

    const stream = this._mediaStream;

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      this._subscriptionKey,
      this._locationRegion
    );

    speechConfig.speechRecognitionLanguage = this._speechRecognitionLanguage;

    const audioConfig = sdk.AudioConfig.fromStreamInput(stream);

    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    this._recognizer = recognizer;

    // TODO: Refactor
    (() => {
      recognizer.recognizing = (s, e) => {
        // FIXME: (jh) Is there a more appropriate place to put this?
        /*
        if (!this._isConnected) {
          this._isConnected = true;

          this.emit(EVT_CONNECT);
        }
        */

        this.log.debug(`RECOGNIZING: Text=${e.result.text}`);

        this._setRealTimeTranscription(e.result.text);
      };

      recognizer.recognized = (s, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
          this._setFinalizedTranscription(e.result.text);

          this.log.debug(`RECOGNIZED: Text=${e.result.text}`);
        } else if (e.result.reason === sdk.ResultReason.NoMatch) {
          this._setIsRecognizing(false);

          this.log.debug("NOMATCH: Speech could not be recognized.");
        }
      };

      recognizer.canceled = async (s, e) => {
        this._setIsRecognizing(false);

        this.log.debug(`CANCELED: Reason=${e.reason}`);

        if (e.reason === sdk.CancellationReason.Error) {
          this.log.debug(`"CANCELED: ErrorCode=${e.errorCode}`);
          this.log.debug(`"CANCELED: ErrorDetails=${e.errorDetails}`);
          this.log.debug(
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
        this.log.debug("Session stopped event");
        recognizer.stopContinuousRecognitionAsync();
      };

      // Start recognizing
      recognizer.startContinuousRecognitionAsync();
    })();
  }
}
