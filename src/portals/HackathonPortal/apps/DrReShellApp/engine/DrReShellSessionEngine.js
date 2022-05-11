import PhantomCore, {
  EVT_UPDATED,
  EVT_DESTROYED,
  getUnixTime,
} from "phantom-core";
import ElizaBot from "./ElizaBotController";

export { EVT_UPDATED, EVT_DESTROYED };

const EVT_CHAR_INPUT = "text-input";

export const PHASE_AUTO_RESPONSE_TYPING = "auto-response-typing";
export const PHASE_AWAITING_USER_INPUT = "awaiting-user-input";

// TODO: Document
export default class DrReShellSessionEngine extends PhantomCore {
  constructor({ posSpeechAnalyzer }) {
    super();

    this._lastTextInputTime = null;

    // TODO: Handle text input timeout

    this._history = [];

    this._posSpeechAnalyzer = posSpeechAnalyzer;
    this.registerCleanupHandler(() => (this._posSpeechAnalyzer = null));

    // Initial phase
    this._phase = PHASE_AUTO_RESPONSE_TYPING;

    this._totalInteractions = 0;

    this._sentiment = "Unknown";

    this._elizaBot = new ElizaBot();
    this._response = this._elizaBot.start();
    this.registerCleanupHandler(() => (this._elizaBot = null));
  }

  // TODO: Process input
  // TODO: Don't just accept finalized input so that we can determine if the user is asleep
  processCharInput(char) {
    this._lastTextInputTime = getUnixTime();

    this.emit(EVT_CHAR_INPUT, char);
  }

  // TODO: Document
  async processText(textInput) {
    // TODO: Move character stripping to text input
    const text = textInput.replace("> ", "").trim();

    if (!text.length) {
      return;
    }

    // TODO: Only push if finalized
    this._history.push(textInput);
    this._history.push("");

    // Increment the interactions
    ++this._totalInteractions;

    const { title: sentiment } =
      (await this._posSpeechAnalyzer.fetchSentimentAnalysis(textInput)) || {
        title: "Neutral",
      };

    this._sentiment = sentiment;

    // Update the UI
    this.emit(EVT_UPDATED);

    this._response = this._elizaBot.reply(text);

    this.switchPhase(PHASE_AUTO_RESPONSE_TYPING);
  }

  // TODO: Document
  getHistory() {
    return this._history;
  }

  // TODO: Document
  getResponse() {
    return this._response;
  }

  // TODO: Document
  addResponseToHistory(responseText) {
    this._history.push(responseText);

    this.switchPhase(PHASE_AWAITING_USER_INPUT);
  }

  // TODO: Document
  switchPhase(phase) {
    this._phase = phase;
    this.emit(EVT_UPDATED);
  }

  // TODO: Document
  getPhase() {
    return this._phase;
  }

  // TODO: Document
  getTotalInteractions() {
    return this._totalInteractions;
  }

  // TODO: Document
  getSentiment() {
    return this._sentiment;
  }

  // TODO: Gather data structure for rendering
}
