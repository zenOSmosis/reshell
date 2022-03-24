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

    this._apiKey = apiKey;
    this._deepgram = null;
    this._deepgramSocket = null;
    this._mediaRecorder = null;

    this.registerCleanupHandler(() => this._stopDeepgram());
  }

  async _stopDeepgram() {
    if (this._mediaRecorder) {
      this._mediaRecorder.stop();
    }

    if (this._deepgramSocket) {
      this._deepgramSocket.close();

      this._deepgram = null;
      this._deepgramSocket = null;
    }
  }

  // TODO: Implement?
  /**
   * Retrieves the language code for this recognizer.
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
   * @return {Promise<void>}
   */
  async _startRecognizing() {
    // Stop previous instance
    await this._stopDeepgram();

    this.emit(EVT_CONNECTING);

    this._deepgram = new Deepgram(this._apiKey);
    this._deepgramSocket = this._deepgram.transcription.live({
      puncturate: true,
    });
    this._mediaRecorder = new MediaRecorder(this._mediaStream, {
      mimeType: "audio/webm",
    });

    // TODO: Patch as necessary; see related ws issue: https://github.com/deepgram/deepgram-node-sdk/issues/38
    // Solution: https://github.com/deepgram-devs/browser-mic-streaming/blob/main/index.html#L17

    this._deepgramSocket.addListener("open", () => {
      this.emit(EVT_CONNECTED);

      this._mediaRecorder.addListener("dataavailable", event => {
        if (event.data.size > 0 && this._deepgramSocket.readyState === 1) {
          this._deepgramSocket.send(event.data);
        }

        // FIXME: (jh) Adjust as necessary
        this._mediaRecorder.start(500);
      });

      this._deepgramSocket.addListener("transcriptReceived", received => {
        // TODO: Remove
        console.log({ received });

        // TODO: Handle
        /*
        const transcript = received.channel.alternatives[0].transcript;
        if (transcript && received.is_final) {
          console.log(transcript);
        }
        */
      });
    });
  }
}
