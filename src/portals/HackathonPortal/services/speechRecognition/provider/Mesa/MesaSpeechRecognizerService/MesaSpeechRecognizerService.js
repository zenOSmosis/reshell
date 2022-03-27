import SpeechRecognizerServiceCore from "../../../__common__/SpeechRecognizerServiceCore";

import MesaSpeechRecognizer from "./MesaSpeechRecognizer";

import MesaSubscriptionKeyManagementService from "../MesaSubscriptionKeyManagementService";

/**
 * Manages the creation and destruction of MesaSpeechRecognizer instances.
 */
export default class MesaSpeechRecognizerService extends SpeechRecognizerServiceCore {
  // TODO: Document
  constructor(...args) {
    super(MesaSubscriptionKeyManagementService, ...args);

    this.setTitle("Mesa Speech Recognizer Service");
  }

  /**
   * For documentation purposes, retrieves the service provider URL which
   * supplies the speech recognition to ReShell.
   *
   * @return {string}
   */
  getServiceProviderURL() {
    return "https://azure.microsoft.com/en-us/services/cognitive-services/speech-to-text/";
  }

  /**
   * @param {MediaStream} mediaStream
   * @param {Object} props TODO: Document props
   * @return {Promise<DeepgramSpeechRecognizer>}
   */
  async _createRecognizer(mediaStream, { subscriptionKey }) {
    return new MesaSpeechRecognizer(mediaStream, subscriptionKey);
  }

  /**
   * Starts the speech recognition engine.
   *
   * @return {Promise<void>}
   */
  async startRecognizing() {
    const subscriptionKey = await this._apiKeyManagementService.acquireAPIKey();

    return super.startRecognizing({ subscriptionKey });
  }
}
