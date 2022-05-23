import PhantomCore, { EVT_BEFORE_DESTROY, EVT_DESTROY } from "phantom-core";

export const EVT_CONNECTING = "connecting";
export const EVT_CONNECT = "connect";
export const EVT_DISCONNECT = "disconnect";

export const EVT_BEGIN_RECOGNIZE = "begin-recognize";
export const EVT_END_RECOGNIZE = "end-recognize";

// Emits with the current text being recognized
// TODO: Document that this emits with text
export const EVT_REAL_TIME_TRANSCRIPTION = "real-time-transcription";

// TODO: Document that this emits with text
export const EVT_FINALIZED_TRANSCRIPTION = "finalized-transcription";

export { EVT_BEFORE_DESTROY, EVT_DESTROY };

// TODO: Ensure this automatically stops when the input stops or after a
// certain amount of time

/**
 * Base class which provider-specific speech API classes derive from.
 */
export default class SpeechRecognizerBase extends PhantomCore {
  // FIXME: (jh) Force to be extended (relates to: https://github.com/zenOSmosis/phantom-core/issues/149)

  /**
   * @param {MediaStream} mediaStream // FIXME: (jh) or MediaStreamTrack?
   * @param {Object} options? [default = {}]
   */
  constructor(mediaStream, options) {
    super(options);

    /**
     * Whether or not the speech engine is connecting
     *
     * @type {boolean}
     */
    this._isConnecting = false;

    /**
     * Whether or not the speech engine is connected
     *
     * @type {boolean}
     **/
    this._isConnected = false;

    /**
     * Whether or not the speech engine is currently recognizing (otherwise
     * known as voice activity detection [or VAD])
     *
     * @type {boolean}
     **/
    this._isRecognizing = false;

    // TODO: Automatically destroy if the media stream stops (may need to make
    // an API in media-stream-controller)
    this._mediaStream = mediaStream;

    // Automatically start recognizing (allow events to be bound first)
    setImmediate(() => {
      this._startRecognizing();
    });

    this.registerCleanupHandler(() => this._stopRecognizing());
  }

  /**
   * Instantiates the speech engine servicing and binds its lifecycle to this
   * class.
   *
   * @return {Promise<void>}
   */
  async _startRecognizing() {
    throw new Error("_startRecognizing must be overridden");
  }

  /**
   * Instantiates the speech engine servicing and binds its lifecycle to this
   * class.
   *
   * @return {Promise<void>}
   */
  async _stopRecognizing() {
    throw new Error("_startRecognizing must be overridden");
  }

  /**
   * Sets whether or not the speech recognizer is connecting.
   *
   * @param {boolean} isConnecting
   */
  _setIsConnecting(isConnecting) {
    isConnecting = Boolean(isConnecting);

    if (this._isConnecting !== isConnecting) {
      this._isConnecting = isConnecting;

      if (isConnecting) {
        this.emit(EVT_CONNECTING);
      }
    }
  }

  /**
   * Retrieves whether or not the speeech recognizer is connecting.
   *
   * @return {boolean}
   */
  getIsConnecting() {
    return this._isConnecting;
  }

  /**
   * Sets whether or not the speech recognizer is connected.
   *
   * @param {boolean} isConnected
   * @emits EVT_CONNECT
   * @emits EVT_DISCONNECT
   * @return {void}
   */
  _setIsConnected(isConnected) {
    isConnected = Boolean(isConnected);

    if (this._isConnected !== isConnected) {
      this._setIsConnecting(false);

      this._isConnected = isConnected;

      if (isConnected) {
        this.emit(EVT_CONNECT);
      } else {
        this.emit(EVT_DISCONNECT);
      }
    }
  }

  /**
   * Retrieves whether or not the speech recognizer is connected.
   *
   * @return {boolean}
   */
  getIsConnected() {
    return this._isConnected;
  }

  /**
   * Sets whether or not the speech recognizer is currently recognizing a
   * transcription.
   *
   * @param {boolean} isRecognizing
   * @emits EVT_BEGIN_RECOGNIZE
   * @emits EVT_END_RECOGNIZE
   * @return {void}
   */
  _setIsRecognizing(isRecognizing) {
    isRecognizing = Boolean(isRecognizing);

    if (this._isRecognizing !== isRecognizing) {
      this._isRecognizing = isRecognizing;

      if (isRecognizing) {
        this.emit(EVT_BEGIN_RECOGNIZE);
      } else {
        this.emit(EVT_END_RECOGNIZE);
      }
    }
  }

  /**
   * Retrieves whether or not the speech recognizer is currently recognizing a
   * transcription.
   *
   * @return {boolean}
   */
  getIsRecognizing() {
    return this._isRecognizing;
  }

  /**
   * Sets whether or not the speech is currently being recognized.
   *
   * @param {string} text
   * @return {void}
   */
  _setRealTimeTranscription(text) {
    // FIXME: (jh) This is in place as a fallback because I wasn't able to find
    // an appropriate connect event with Azure
    this._setIsConnected(true);

    this._setIsRecognizing(true);

    this.emit(EVT_REAL_TIME_TRANSCRIPTION, text);
  }

  /**
   * Sets the finalized speech transcription.
   *
   * @param {string} text
   * @emits EVT_FINALIZED_TRANSCRIPTION
   * @return {void}
   */
  _setFinalizedTranscription(text) {
    this._setIsRecognizing(false);

    // Update real-time transcription, as well, with finalized text
    this.emit(EVT_REAL_TIME_TRANSCRIPTION, text);

    this.emit(EVT_FINALIZED_TRANSCRIPTION, text);
  }
}
