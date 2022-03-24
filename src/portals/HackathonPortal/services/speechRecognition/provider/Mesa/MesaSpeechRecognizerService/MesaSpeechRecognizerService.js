import SpeechRecognizerServiceBase, {
  EVT_UPDATED,
} from "../../../__common__/SpeechRecognizerServiceBase";

import MesaSpeechRecognizer, {
  EVT_TRANSCRIPTION_FINALIZED,
} from "./MesaSpeechRecognizer";

import MesaSubscriptionKeyManagementService from "../MesaSubscriptionKeyManagementService";

export { EVT_UPDATED, EVT_TRANSCRIPTION_FINALIZED };

/**
 * Manages the creation and destruction of MesaSpeechRecognizer instances.
 */
export default class MesaSpeechRecognizerService extends SpeechRecognizerServiceBase {
  constructor(...args) {
    super(...args);

    this.setTitle("Mesa Speech Recognizer Service");

    /** @type {MesaSubscriptionKeyManagementService} */
    this._subscriptionKeyService = this.useServiceClass(
      MesaSubscriptionKeyManagementService
    );
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
    const subscriptionKey = await this._subscriptionKeyService.acquireAPIKey();

    return super.startRecognizing({ subscriptionKey });
  }
}
