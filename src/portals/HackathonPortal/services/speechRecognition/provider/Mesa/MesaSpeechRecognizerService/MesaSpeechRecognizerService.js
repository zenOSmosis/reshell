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

  // TODO: Document
  getServiceProviderURL() {
    return "https://azure.microsoft.com/en-us/services/cognitive-services/speech-to-text/";
  }

  // TODO: Document
  async _createRecognizer(stream, { subscriptionKey }) {
    return new MesaSpeechRecognizer(stream, subscriptionKey);
  }

  // TODO: Document
  /**
   * Starts the speech recognition system.
   *
   * @return {Promise<void>}
   */
  async startRecognizing() {
    const subscriptionKey =
      await this._subscriptionKeyService.acquireSubscriptionKey();

    return super.startRecognizing({ subscriptionKey });
  }
}
