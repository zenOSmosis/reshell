import PhantomCore, {
  EVT_READY,
  EVT_UPDATED,
  EVT_DESTROYED,
} from "phantom-core";
import ElizaBotController from "./ElizaBot";

export { EVT_READY, EVT_UPDATED, EVT_DESTROYED };

export const PHASE_AUTO_RESPONSE_TYPING = "auto-response-typing";
export const PHASE_AWAITING_USER_INPUT = "awaiting-user-input";

const DEFAULT_SENTIMENT = "Unknown";

// TODO: Handle text input timeout (i.e. "are you there?")

/**
 * Input / Output phase-switching engine for ElizaBot service.
 */
export default class DrReShellSessionEngine extends PhantomCore {
  constructor({ posSpeechAnalyzer }) {
    super({ isAsync: true });

    this._lastTextInputTime = null;

    this._history = [];

    this._posSpeechAnalyzer = posSpeechAnalyzer;
    this.registerCleanupHandler(() => (this._posSpeechAnalyzer = null));

    // Initial phase
    this._phase = null;

    this._totalInteractions = 0;

    this._sentiment = DEFAULT_SENTIMENT;
    this._score = 0;

    this._elizaBot = new ElizaBotController();
    this.registerCleanupHandler(() => this._elizaBot.destroy());

    this._response = null;

    this._init();
  }

  async _init() {
    await this._elizaBot.onceReady();

    // Create initiating conversation
    this._response = await this._elizaBot.start();

    // Simulate auto-typing phase
    this._phase = PHASE_AUTO_RESPONSE_TYPING;

    return super._init();
  }

  /**
   * Processes input text.
   *
   * @param {string} textInput
   * @return {Promise<void>}
   */
  async processText(textInput) {
    // TODO: Move character stripping to text input
    const text = textInput.replace("> ", "").trim();

    if (!text.length) {
      return;
    }

    this._history.push(textInput);

    // Increment the interactions
    ++this._totalInteractions;

    const { title: sentiment, score } =
      (await this._posSpeechAnalyzer.fetchSentimentAnalysis(textInput)) || {
        title: "Neutral",
      };

    if (score !== 0 || this._sentiment === DEFAULT_SENTIMENT) {
      this._sentiment = sentiment;
    }

    const scoreAddend = score * 1000;
    if (scoreAddend) {
      this._history.push(`${scoreAddend > 0 ? "+" : ""}${scoreAddend}`);
    }

    this._score += scoreAddend;

    // Add intentional empty line
    this._history.push("");

    // Update the UI
    this.emit(EVT_UPDATED);

    this._response = await this._elizaBot.reply(text);

    this.switchPhase(PHASE_AUTO_RESPONSE_TYPING);
  }

  /**
   * Retrieves the text history string array.
   *
   * @return {string[]}
   */
  getHistory() {
    return this._history;
  }

  /**
   * Retrieves the bot's most recent response.
   *
   * @return {string}
   */
  getResponse() {
    return this._response;
  }

  /**
   * Adds the bot's most recent response to history.
   *
   * This is a public method to help facilitate the UI's typing effect.
   *
   * @param {string} responseText
   */
  addResponseToHistory(responseText) {
    this._history.push(responseText);

    this.switchPhase(PHASE_AWAITING_USER_INPUT);
  }

  /**
   * Switches the input / output phase.
   *
   * @param {PHASE_AUTO_RESPONSE_TYPING | PHASE_AWAITING_USER_INPUT} phase
   * @return {void}
   */
  switchPhase(phase) {
    this._phase = phase;
    this.emit(EVT_UPDATED);
  }

  /**
   * Retrieves the current phase.
   *
   * @return {PHASE_AUTO_RESPONSE_TYPING | PHASE_AWAITING_USER_INPUT}
   */
  getPhase() {
    return this._phase;
  }

  /**
   * Retrieves the current number of interactions.
   *
   * @return {number}
   */
  getTotalInteractions() {
    return this._totalInteractions;
  }

  /**
   * Retrieves the current sentiment.
   *
   * @return {string}
   */
  getSentiment() {
    return this._sentiment;
  }

  /**
   * @return {number}
   */
  getScore() {
    return this._score;
  }
}
