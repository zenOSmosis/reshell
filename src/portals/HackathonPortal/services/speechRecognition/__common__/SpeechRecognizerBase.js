import PhantomCore, { EVT_BEFORE_DESTROY, EVT_DESTROYED } from "phantom-core";

export const EVT_CONNECTING = "connecting";
export const EVT_CONNECTED = "connected";

export const EVT_BEGIN_RECOGNIZE = "begin-recognize";
export const EVT_END_RECOGNIZE = "end-recognize";

// Emits with the current text being recognized
export const EVT_TRANSCRIPTION_RECOGNIZING = "transcription-recognizing";

// TODO: Document that this emits with text
export const EVT_TRANSCRIPTION_FINALIZED = "transcription-finalized";

export { EVT_BEFORE_DESTROY, EVT_DESTROYED };

export default class SpeechRecognizerBase extends PhantomCore {
  // FIXME: (jh) Force to be extended (relates to: https://github.com/zenOSmosis/phantom-core/issues/149)

  /**
   * @param {MediaStream} mediaStream // or MediaStreamTrack?
   * @param {Object} options? [default = {}]
   */
  constructor(mediaStream, options) {
    super(options);

    /** @type {boolean} Whether or not the speech engine is connected to */
    this._isConnected = false;

    // TODO: Automatically stop when the media stream stops
    this._mediaStream = mediaStream;

    // Automatically start recognizing (allow events to be bound first)
    setImmediate(() => {
      this._startRecognizing();
    });
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
    if (!this._isConnected) {
      this.emit(EVT_CONNECTED);
    }

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

  // TODO: Document
  async _initSpeechEngine() {
    throw new Error("_initSpeechEngine must be overridden");
  }

  // TODO: Document
  async _destructSpeechEngine() {
    throw new Error("_destructSpeechEngine must be overridden");
  }

  // TODO: Ensure this instance is automatically destructed if the speech
  // service errors or has a network error
  /**
   * Starts the speech recognition processing, performs remote event binding to
   * the class instance, and handles cleanup operations.
   *
   * @return {void}
   */
  // _startRecognizing() {}
}
