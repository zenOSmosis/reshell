import SpeechRecognizerServiceCore from "../../../__common__/SpeechRecognizerServiceCore";

import DeepgramSpeechRecognizer from "./DeepgramSpeechRecognizer";

import DeepgramAPIKeyManagementService from "../DeepgramAPIKeyManagementService";

/**
 * Manages the creation and destruction of MesaSpeechRecognizer instances.
 */
export default class DeepgramSpeechRecognizerService extends SpeechRecognizerServiceCore {
  // TODO: Document
  constructor(...args) {
    super(DeepgramAPIKeyManagementService, ...args);

    this.setTitle("Deepgram Speech Recognizer Service");
  }

  /**
   * For documentation purposes, retrieves the service provider URL which
   * supplies the speech recognition to ReShell.
   *
   * @return {string}
   */
  getServiceProviderURL() {
    return "https://deepgram.com/";
  }

  /**
   * @param {MediaStream} mediaStream
   * @param {Object} props TODO: Document
   * @return {Promise<DeepgramSpeechRecognizer>}
   */
  async _createRecognizer(mediaStream, { apiKey }) {
    return new DeepgramSpeechRecognizer(mediaStream, apiKey);
  }

  /**
   * Starts the speech recognition system.
   *
   * @return {Promise<void>}
   */
  async startRecognizing() {
    const apiKey = await this._apiKeyManagementService.acquireAPIKey();

    return super.startRecognizing({ apiKey });
  }
}
