import SpeechRecognizerServiceBase, {
  EVT_UPDATED,
} from "../../classes/SpeechRecognizerServiceBase";

import MesaSpeechRecognizer, {
  EVT_CONNECTING,
  EVT_TRANSCRIPTION_FINALIZED,
} from "./MesaSpeechRecognizer";

import MesaSubscriptionKeyManagementService from "../MesaSubscriptionKeyManagementService";

import UIModalWidgetService from "@services/UIModalWidgetService";

export { EVT_UPDATED, EVT_TRANSCRIPTION_FINALIZED };

// TODO: Refactor w/ SpeechRecognizerRegistrationService
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

  // TODO: Refactor
  // TODO: Document
  /**
   * Starts the speech recognition system.
   *
   * @return {Promise<void>}
   */
  async startRecognizing() {
    if (this._recognizer) {
      await this._recognizer.destroy();
    }

    this.emit(EVT_CONNECTING);

    const subscriptionKey =
      await this._subscriptionKeyService.acquireSubscriptionKey();

    if (!subscriptionKey) {
      return;
    }

    let inputCaptureFactories =
      this._inputMediaDevicesService.getCaptureFactories();

    // Present UIModal to start input
    // TODO: Filter to only capturing audio
    if (!inputCaptureFactories.length) {
      await this.useServiceClass(
        UIModalWidgetService
      ).showInputMediaDevicesSelectionModal();
    }

    inputCaptureFactories =
      this._inputMediaDevicesService.getCaptureFactories();

    // FIXME: (jh) Handle more nicely?
    // TODO: Ensure we're capturing audio
    if (!inputCaptureFactories.length) {
      throw new Error("Could not obtain input capture factories");
    }

    // TODO; Refactor
    const stream = inputCaptureFactories[0].getOutputMediaStream();

    // TODO: If not able to instantiate based on subscription key issue, unset
    // the key from the class property & secured local storage, and restart the
    // subscription key acquisition process (would it be easier / better to
    // create a separate service for subscription key handling?)
    this._recognizer = new MesaSpeechRecognizer(stream, subscriptionKey);

    this.setState({ hasRecognizer: true });

    this._recognizer.registerCleanupHandler(() => {
      // FIXME: (jh) Reset state once implemented
      // Relevant issue: https://github.com/zenOSmosis/phantom-core/issues/112
      this.setState({
        isConnecting: false,
        isConnected: false,
        hasRecognizer: false,
        isRecognizing: false,
        realTimeTranscription: null,
        finalizedTranscription: null,
      });
    });
  }
}
