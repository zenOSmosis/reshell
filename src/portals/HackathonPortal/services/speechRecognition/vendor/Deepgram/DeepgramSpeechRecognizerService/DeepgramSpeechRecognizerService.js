import SpeechRecognizerServiceBase, {
  EVT_UPDATED,
} from "../__common__/SpeechRecognizerServiceBase";

import DeepgramSpeechRecognizer, {
  EVT_TRANSCRIPTION_FINALIZED,
} from "./DeepgramSpeechRecognizer";

// import MesaSubscriptionKeyManagementService from "../MesaSubscriptionKeyManagementService";

export { EVT_UPDATED, EVT_TRANSCRIPTION_FINALIZED };

/**
 * Manages the creation and destruction of MesaSpeechRecognizer instances.
 */
export default class DeepgramSpeechRecognizerService extends SpeechRecognizerServiceBase {
  constructor(...args) {
    super(...args);

    this.setTitle("Deepgram Speech Recognizer Service");

    /** @type {MesaSubscriptionKeyManagementService} */
    /*
    this._subscriptionKeyService = this.useServiceClass(
      MesaSubscriptionKeyManagementService
    );
    */
  }

  // TODO: Document
  async _createRecognizer(stream, { apiKey }) {
    return new DeepgramSpeechRecognizer(stream, apiKey);
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
