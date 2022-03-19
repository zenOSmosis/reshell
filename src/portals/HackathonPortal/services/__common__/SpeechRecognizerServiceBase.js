// TODO: Ensure this class IS extended
import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";

import {
  EVT_CONNECTING,
  EVT_CONNECTED,
  EVT_BEGIN_RECOGNIZE,
  EVT_TRANSCRIPTION_RECOGNIZING,
  EVT_END_RECOGNIZE,
  EVT_TRANSCRIPTION_FINALIZED,
} from "./SpeechRecognizerBase";

import InputMediaDevicesService from "@services/InputMediaDevicesService";
import UIModalWidgetService from "@services/UIModalWidgetService";

export { EVT_UPDATED, EVT_TRANSCRIPTION_FINALIZED };

/**
 * Manages the creation and destruction of MesaSpeechRecognizer instances.
 */
export default class SpeechRecognizerServiceBase extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setState({
      isConnecting: false,
      isConnected: false,
      hasRecognizer: false,
      isRecognizing: false,
      realTimeTranscription: null,
      finalizedTranscription: null,
    });

    // TODO: Auto-destruct after a certain amount of time after not retrieving
    // a finalized transcription

    /** @type {SpeechRecognizerBase} */
    this._recognizer = null;

    this.registerCleanupHandler(async () => {
      if (this._recognizer) {
        await this._recognizer.destroy();
      }
    });

    // Handle recognizer event binding
    this.on(EVT_UPDATED, (updatedState = {}) => {
      if (updatedState.hasRecognizer) {
        this.proxyOn(this._recognizer, EVT_CONNECTING, () => {
          this.setState({ isConnecting: true });
          this.setState({ isConnected: false });
        });

        this.proxyOn(this._recognizer, EVT_CONNECTED, () => {
          this.setState({ isConnecting: false });
          this.setState({ isConnected: true });
        });

        this.proxyOn(this._recognizer, EVT_BEGIN_RECOGNIZE, () => {
          this.setState({ isRecognizing: true });
        });

        this.proxyOn(this._recognizer, EVT_END_RECOGNIZE, () => {
          this.setState({ isRecognizing: false });
        });

        this.proxyOn(this._recognizer, EVT_TRANSCRIPTION_RECOGNIZING, text => {
          this.setState({ realTimeTranscription: text });
        });

        this.proxyOn(this._recognizer, EVT_TRANSCRIPTION_FINALIZED, text => {
          this.setState({ finalizedTranscription: text });

          // Re-emit
          this.emit(EVT_TRANSCRIPTION_FINALIZED, text);
        });
      }
    });

    /** @type {InputMediaDevicesService} */
    this._inputMediaDevicesService = this.useServiceClass(
      InputMediaDevicesService
    );
  }

  /**
   * Whether or not the speech recognizer is connecting.
   *
   * @return {boolean}
   */
  getIsConnecting() {
    return this.getState().isConnecting;
  }

  /**
   * Whether or not the speech recognizer is connected.
   *
   * @return {boolean}
   */
  getIsConnected() {
    return this.getState().isConnected;
  }

  /**
   * Retrieves whether or not the MesaSpeechRecognizer is active.
   *
   * @return {boolean}
   */
  getHasRecognizer() {
    return this.getState().hasRecognizer;
  }

  /**
   * Retrieves the non-finalized speech transcription.
   *
   * NOTE: This will emit much faster than the finalized transcription and may
   * automatically correct itself as words are spoken.
   *
   * @return {string | null}
   */
  getRealTimeTranscription() {
    return this.getState().realTimeTranscription;
  }

  /**
   * Retrieves the last finalized transcription received.
   *
   * @return {string | null}
   */
  getFinalizedTranscription() {
    return this.getState().finalizedTranscription;
  }

  /**
   * Retrieves whether or not the system is currently recognizing speech.
   *
   * @return {boolean}
   */
  getIsRecognizing() {
    return this.getState().isRecognizing;
  }

  // TODO: Document
  async _createRecognizer(stream, recognizerParams) {
    throw new Error("_createRecognizer must be overridden");
  }

  // TODO: Refactor
  // TODO: Document
  /**
   * Starts the speech recognition system.
   *
   * @return {Promise<void>}
   */
  async startRecognizing(recognizerParams = {}) {
    if (this._recognizer) {
      await this._recognizer.destroy();
    }

    this.emit(EVT_CONNECTING);

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

    this._recognizer = await this._createRecognizer(stream, recognizerParams);

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

  /**
   * Stops the speech recognition system.
   *
   * @return {Promise<void>}
   */
  async stopRecognizing() {
    if (this._recognizer) {
      await this._recognizer.destroy();
    }
  }
}