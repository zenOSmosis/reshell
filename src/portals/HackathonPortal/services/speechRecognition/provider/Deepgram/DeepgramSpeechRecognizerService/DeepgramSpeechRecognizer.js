import SpeechRecognizerBase, {
  EVT_BEFORE_DESTROY,
  EVT_DESTROYED,
} from "../../../__common__/SpeechRecognizerBase";

export const EVT_CONNECTING = "connecting";
export const EVT_CONNECTED = "connected";

export const EVT_BEGIN_RECOGNIZE = "begin-recognize";
export const EVT_END_RECOGNIZE = "end-recognize";

// Emits with the current text being recognized
export const EVT_TRANSCRIPTION_RECOGNIZING = "transcription-recognizing";

// TODO: Document that this emits with text
export const EVT_TRANSCRIPTION_FINALIZED = "transcription-finalized";

export { EVT_BEFORE_DESTROY, EVT_DESTROYED };

const DEEPGRAM_WSS_ADDRESS = "wss://api.deepgram.com/v1/listen";

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

    this._apiKey = apiKey;
    this._deepgramSocket = null;
    this._mediaRecorder = null;

    this.registerCleanupHandler(() => this._stopDeepgram());
  }

  async _stopDeepgram() {
    if (this._mediaRecorder) {
      this._mediaRecorder.stop();

      this._mediaRecorder = null;
    }

    if (this._deepgramSocket) {
      this._deepgramSocket.close();

      this._deepgramSocket = null;
    }
  }

  // TODO: Ensure this instance is automatically destructed if the speech
  // service errors or has a network error
  /**
   * Starts the speech recognition processing, performs remote event binding to
   * the class instance, and handles cleanup operations.
   *
   * @return {Promise<void>}
   */
  async _startRecognizing() {
    // Stop previous instance
    await this._stopDeepgram();

    this.emit(EVT_CONNECTING);

    this._deepgramSocket = new WebSocket(DEEPGRAM_WSS_ADDRESS, [
      "token",
      this._apiKey,
    ]);

    this._mediaRecorder = new MediaRecorder(this._mediaStream, {
      mimeType: "audio/webm",
    });

    // TODO: Patch as necessary; see related ws issue: https://github.com/deepgram/deepgram-node-sdk/issues/38
    // Solution: https://github.com/deepgram-devs/browser-mic-streaming/blob/main/index.html#L17

    this._deepgramSocket.addEventListener("open", () => {
      this.emit(EVT_CONNECTED);

      this._mediaRecorder.addEventListener("dataavailable", event => {
        if (event.data.size > 0 && this._deepgramSocket?.readyState === 1) {
          this._deepgramSocket.send(event.data);
        }
      });

      // FIXME: (jh) Adjust as necessary
      this._mediaRecorder.start(100);

      this._deepgramSocket.addEventListener("message", message => {
        const received = JSON.parse(message.data);

        const transcript = received.channel.alternatives[0].transcript;

        if (transcript && received.is_final) {
          this._setFinalizedTranscription(transcript);
        } else {
          this.emit(EVT_TRANSCRIPTION_RECOGNIZING, transcript);
        }
      });
    });
  }
}
