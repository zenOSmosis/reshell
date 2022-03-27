import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";
import ExternalAPIKeyManagementServiceCore from "@service.cores/ExternalAPIKeyManagementServiceCore";

import {
  EVT_CONNECTING,
  EVT_CONNECTED,
  EVT_DISCONNECTED,
  EVT_BEGIN_RECOGNIZE,
  EVT_TRANSCRIPTION_RECOGNIZING,
  EVT_END_RECOGNIZE,
  EVT_TRANSCRIPTION_FINALIZED,
} from "./SpeechRecognizerBase";

import InputMediaDevicesService from "@services/InputMediaDevicesService";
import UIModalWidgetService from "@services/UIModalWidgetService";

export { EVT_UPDATED, EVT_TRANSCRIPTION_FINALIZED };

// TODO: Auto-destruct after a certain amount of time after not retrieving
// a finalized transcription

export default class SpeechRecognizerServiceCore extends UIServiceCore {
  // TODO: Turn into a service core (utilize in service.cores directory)
  // TODO: Force to be extended (relates to: https://github.com/zenOSmosis/phantom-core/issues/149)

  /**
   * @param {ExternalAPIKeyManagementServiceCore} ExternalAPIKeyManagementServiceClass
   * A non-instantiated class which manages the API key for the service
   * provider.
   * @param {...args} - The args to pass to the super UIServiceCore.
   */
  constructor(ExternalAPIKeyManagementServiceClass, ...args) {
    super(...args);

    this._apiKeyManagementService = this.useServiceClass(
      ExternalAPIKeyManagementServiceClass
    );

    // Emit EVT_UPDATED when API Key Management Service updates
    // FIXME: (jh) See relevant issue: https://github.com/zenOSmosis/phantom-core/issues/152
    this.proxyOn(this._apiKeyManagementService, EVT_UPDATED, data =>
      this.emit(EVT_UPDATED, data)
    );

    // FIXME: (jh) Validate type before instantiation
    if (
      !(
        this._apiKeyManagementService instanceof
        ExternalAPIKeyManagementServiceCore
      )
    ) {
      throw new TypeError(
        "ExternalAPIKeyManagementServiceClass does not extend ExternalAPIKeyManagementServiceCore"
      );
    }

    this.setState({
      isConnecting: false,
      isConnected: false,
      hasRecognizer: false,
      isRecognizing: false,
      realTimeTranscription: null,
      finalizedTranscription: null,
      isControllingDesktop: false,
    });

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
        const _handleConnectStateChange = () => {
          this.setState({
            isConnecting: this._recognizer.getIsConnecting(),
            isConnected: this._recognizer.getIsConnected(),
          });
        };

        this.proxyOn(
          this._recognizer,
          EVT_CONNECTING,
          _handleConnectStateChange
        );
        this.proxyOn(
          this._recognizer,
          EVT_CONNECTED,
          _handleConnectStateChange
        );
        this.proxyOn(
          this._recognizer,
          EVT_DISCONNECTED,
          _handleConnectStateChange
        );

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
   * Retrieves the API key manager for this speech recognizer.
   *
   * @return {ExternalAPIKeyManagementService}
   */
  getAPIKeyManagementService() {
    return this._apiKeyManagementService;
  }

  /**
   * For documentation purposes, retrieves the service provider URL which
   * supplies the speech recognition to ReShell.
   *
   * @return {string}
   */
  getServiceProviderURL() {
    throw new Error("getServiceProviderURL must be overridden");
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
  async _createRecognizer(mediaStream, recognizerParams) {
    throw new Error("_createRecognizer must be overridden");
  }

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

  /**
   * Sets whether or not the speech recognizer is controlling the desktop.
   *
   * NOTE: Despite the value given it will not be effective if the speech
   * recognizer is not connected.
   *
   * @param {boolean} isControllingDesktop
   * @return {void}
   */
  setIsControllingDesktop(isControllingDesktop) {
    this.setState({ isControllingDesktop: Boolean(isControllingDesktop) });
  }

  /**
   * Retrieves whether or not the speech recognizer is controlling the desktop.
   *
   * NOTE: Despite the value returned it will not be effective if the speech
   * recognizer is not connected.
   *
   * @return {boolean}
   */
  getIsControllingDesktop() {
    return this.getState().isControllingDesktop;
  }

  /**
   * Retrieves the number of seconds the speech recognizer has been instantiated.
   *
   * @return {number}
   */
  getRecognizerUptime() {
    return !this._recognizer ? 0 : this._recognizer.getInstanceUptime();
  }
}
