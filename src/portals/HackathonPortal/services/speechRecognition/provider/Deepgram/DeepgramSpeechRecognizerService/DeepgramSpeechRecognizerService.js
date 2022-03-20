import SpeechRecognizerServiceBase, {
  EVT_UPDATED,
} from "../__common__/SpeechRecognizerServiceBase";

import DeepgramSpeechRecognizer, {
  EVT_TRANSCRIPTION_FINALIZED,
} from "./DeepgramSpeechRecognizer";

// import DeepgramAPIKeyManagementService from "../DeepgramAPIKeyManagementService";

// Deepgram details:
// - Hackathon details: https://dev.to/devteam/join-us-for-a-new-kind-of-hackathon-on-dev-brought-to-you-by-deepgram-2bjd
// - MediaStream implementation: https://github.com/deepgram/deepgram-node-sdk#transcribe-audio-in-real-time

export { EVT_UPDATED, EVT_TRANSCRIPTION_FINALIZED };

/**
 * Manages the creation and destruction of MesaSpeechRecognizer instances.
 */
export default class DeepgramSpeechRecognizerService extends SpeechRecognizerServiceBase {
  constructor(...args) {
    super(...args);

    this.setTitle("Deepgram Speech Recognizer Service");

    /** @type {DeepgramAPIKeyManagementService} */
    /*
    this._subscriptionKeyService = this.useServiceClass(
      DeepgramAPIKeyManagementService
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
