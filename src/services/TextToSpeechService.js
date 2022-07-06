import UIServiceCore, { EVT_UPDATE } from "@core/classes/UIServiceCore";

import LocaleService from "./LocaleService";

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

    // Fixes issue where voices might not be immediately available to a
    // connected app if its auto-loaded at startup.  Note: I started to bake
    // this functionality into UIService itself but ran into startup problems
    // so left it alone.
    //
    // FIXME: (jh) This MAY require user interaction in a new session
    queueMicrotask(() => {
      this.emit(EVT_UPDATE);
    });

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
    return (
      this.getState().defaultVoice ||
      this.getVoices().find(voice => voice.default === true)
    );
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
  getDefaultPitch() {
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
  getDefaultRate() {
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
   * Retrieves the voices which match the system's locale.
   *
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

      // Wait until current utterance has ended before trying to speak again
      //
      // This fixes an issue where Chrome (tested 100.0.4896.75 / Mac Monterey)
      // could crash if concurrent utterances are invoked
      if (this.getIsSpeaking()) {
        await new Promise(resolve => {
          this.cancel();

          const _handleStateChange = () => {
            if (!this.getIsSpeaking()) {
              this.off(EVT_UPDATE, _handleStateChange);

              queueMicrotask(() => {
                resolve();
              });
            }
          };

          this.on(EVT_UPDATE, _handleStateChange);
        });
      }

      // State is set prior to the utterance to fix an issue in Chrome where
      // rapidly invoking "say" could still cause browser to crash (note: this
      // might be resolved but is not causing any harm here)
      this.setState({ isSpeaking: true });

      const rate =
        options.rate !== undefined ? options.rate : this.getDefaultRate();
      const pitch =
        options.pitch !== undefined ? options.pitch : this.getDefaultPitch();
      const voice = options.voice || this.getDefaultVoice();

      const utterance = new SpeechSynthesisUtterance(text);

      // TODO: Dynamically set
      utterance.lang = this._localeService.getLanguageCode();
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.voice = voice;
      utterance.volume = 1; // 0 - 1

      // TODO: Automatically reject if the queue has been canceled

      await new Promise((resolve, reject) => {
        // FIXME: Ensure this is properly ended if externally canceled

        // FIXME: The doubled-up usage of onend and addEventListener helps
        // resolve an issue in Safari 15.3 where the end handler is not
        // called. However, this is still not always reliable.
        utterance.onend = () => resolve();
        utterance.addEventListener("ended", function handleEnd() {
          resolve();

          utterance.removeEventListener("ended", handleEnd);
        });

        utterance.onerror = () => reject();

        this._synth.speak(utterance);
      });
    } catch (err) {
      // TODO: Handle accordingly
      this.log.error(err);
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

    // Safari might not emit onend on the current utterance
    this.setState({ isSpeaking: false });

    return this;
  }
}
