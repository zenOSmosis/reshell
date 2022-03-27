import SpeechRecognizerBase from "../../../__common__/SpeechRecognizerBase";

const DEEPGRAM_WSS_ADDRESS = "wss://api.deepgram.com/v1/listen";

/**
 * Handles direct communication with Deepgram.
 *
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

    this.registerCleanupHandler(() => this._stopRecognizing());
  }

  /**
   * Stops the previous speech recognizer instance.
   *
   * @return {Promise<void>}
   */
  async _stopRecognizing() {
    if (this._mediaRecorder) {
      this._mediaRecorder.stop();

      this._mediaRecorder = null;
    }

    if (this._deepgramSocket) {
      this._deepgramSocket.close();

      this._deepgramSocket = null;
    }
  }

  /**
   * Starts the speech recognition processing, performs remote event binding to
   * the class instance, and handles cleanup operations.
   *
   * Based on the example from:
   * @see https://github.com/deepgram/deepgram-node-sdk#transcribe-audio-in-real-time
   *
   * @return {Promise<void>}
   */
  async _startRecognizing() {
    // Stop previous instance
    await this._stopRecognizing();

    this._setIsConnecting(true);

    this._deepgramSocket = new WebSocket(DEEPGRAM_WSS_ADDRESS, [
      "token",
      this._apiKey,
    ]);

    this._mediaRecorder = new MediaRecorder(this._mediaStream, {
      mimeType: "audio/webm",
    });

    this._deepgramSocket.addEventListener("open", () => {
      this._setIsConnected(true);

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
          this._setRealTimeTranscription(transcript);
        }
      });

      this._deepgramSocket.addEventListener("close", () => this.destroy());
    });
  }
}
