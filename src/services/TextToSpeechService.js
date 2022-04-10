import UIServiceCore from "@core/classes/UIServiceCore";

import LocaleService from "./LocaleService";

// FIXME: (jh) Refactor so concurrent utterances can be made at once?

/**
 * Manages speech-to-text servicing.
 */
export default class TextToSpeechService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Text to Speech Service");

    this.setState({
      isSpeaking: false,

      defaultVoice: null,

      defaultPitch: 1,

      defaultRate: 1,
    });

    /** @type {LocaleService} */
    this._localeService = this.useServiceClass(LocaleService);

    /** @type {SpeechSynthesis} */
    this._synth = null;

    /** @type {SpeechSynthesisVoice[]} */
    this._voices = [];

    /** @type {SpeechSynthesisVoice[]} */
    this._localeVoices = [];
  }

  /**
   * Initialize speech synthesis.
   *
   * @return {Promise<void>}
   */
  async _init() {
    // @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
    this._synth = window.speechSynthesis;

    return super._init();
  }

  /**
   * @return {SpeechSynthesisVoice[]}
   */
  getVoices() {
    if (!this._voices.length) {
      this._voices = this._synth?.getVoices() || [];
    }

    return this._voices;
  }

  /**
   * @param {SpeechSynthesisVoice} defaultVoice
   * @return {TextToSpeechService}
   */
  setDefaultVoice(defaultVoice) {
    this.setState({ defaultVoice });

    return this;
  }

  /**
   * @return {SpeechSynthesisVoice | null}
   */
  getDefaultVoice() {
    return this.getState().defaultVoice;
  }

  /**
   * Sets the default pitch for speech utterance.
   *
   * @param {number} defaultPitch A floating point number from 0.0 - 1.0
   * @return {TextToSpeechService}
   */
  setDefaultPitch(defaultPitch) {
    this.setState({ defaultPitch });

    return this;
  }

  /**
   * Retrieves the default pitch for speech utterance.
   *
   * @return {number} A floating point number from 0.0 - 1.0
   */
  getDefaultPitch(defaultPitch) {
    return this.getState().defaultPitch;
  }

  /**
   * Sets the default rate for speech utterance.
   *
   * @param {number} defaultRate A floating point number from 0.0 - 1.0
   * @return {TextToSpeechService}
   */
  setDefaultRate(defaultRate) {
    this.setState({ defaultRate });

    return this;
  }

  /**
   * Retrieves the default rate for speech utterance.
   *
   * @return {number} A floating point number from 0.0 - 1.0
   */
  getDefaultRate(defaultRate) {
    return this.getState().defaultRate;
  }

  /**
   * @param {string} voiceURI
   * @return {SpeechSynthesisVoice | void}
   */
  getVoiceWithURI(voiceURI) {
    return this.getVoices().find(voice => voice.voiceURI === voiceURI);
  }

  /**
   * @return {SpeechSynthesisVoice[]}
   */
  getLocaleVoices() {
    // FIXME: Bust this cache if the locale changes
    if (!this._localeVoices.length) {
      const languageCode = this._localeService.getLanguageCode();

      this._localeVoices = this.getVoices().filter(
        voice => voice.lang === languageCode
      );
    }

    return this._localeVoices;
  }

  /**
   *
   * Note, Speech Synthesis in Chrome since version 55 stops playback after
   * about 15 seconds.
   * @see https://caniuse.com/speech-synthesis
   *
   * @param {string} text
   * @param {Object} options? // TODO: Document
   * @return {Promise<TextToSpeechService>}
   */
  async say(text, options = {}) {
    try {
      await this.onceReady();

      const rate =
        options.rate !== undefined ? options.rate : this.getDefaultRate();
      const pitch =
        options.pitch !== undefined ? options.pitch : this.getDefaultPitch();
      const voice = options.voice || this.getDefaultVoice();

      // TODO: Integrate
      //
      // TODO: Listen for speech end event before resolving
      // https://wicg.github.io/speech-api/#dom-speechsynthesisutterance-speechsynthesisutterance
      //
      // TODO: Automatically reject if the queue has been canceled

      const utterance = new SpeechSynthesisUtterance(text);

      // TODO: Dynamically set
      utterance.lang = this._localeService.getLanguageCode();
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.voice = voice;
      utterance.volume = 1; // 0 - 1

      await new Promise((resolve, reject) => {
        // FIXME: Ensure this is properly ended if externally canceled

        utterance.onend = () => resolve();

        utterance.onerror = () => reject();

        this._synth.speak(utterance);

        this.setState({ isSpeaking: true });
      });
    } catch (err) {
      // TODO: Handle accordingly
      console.error(err);
    } finally {
      this.setState({ isSpeaking: false });

      return this;
    }
  }

  /**
   * Retrieves whether or not the TTS engine is currently speaking.
   *
   * @return {boolean}
   */
  getIsSpeaking() {
    return this.getState().isSpeaking;
  }

  /**
   * Stops words from being spoken immediately and removes remaining words from
   * the queue.
   *
   * @return {TextToSpeechService}
   */
  cancel() {
    this._synth?.cancel();

    return this;
  }
}
