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

    this._elizaBot = new ElizaBot();
    this._response = this._elizaBot.start();
    this.registerCleanupHandler(() => (this._elizaBot = null));

    this._totalInteractions = 0;
  }

  // TODO: Process input
  // TODO: Don't just accept finalized input so that we can determine if the user is asleep
  processCharInput(char) {
    this._lastTextInputTime = getUnixTime();

    this.emit(EVT_CHAR_INPUT, char);
  }

  // TODO: Document
  async processText(textInput) {
    // TODO: Only push if finalized
    this._history.push(textInput);
    this._history.push("");

    // Increment the interactions
    ++this._totalInteractions;

    // Update the UI
    this.emit(EVT_UPDATED);

    const [sentiment, partsOfSpeech] = await Promise.all([
      this._posSpeechAnalyzer.fetchSentimentAnalysis(textInput),
      this._posSpeechAnalyzer.fetchPartsOfSpeech(textInput),
    ]);

    // TODO: Remove
    console.log({ sentiment, partsOfSpeech });

    this._response = this._elizaBot.reply(textInput.replace("> ", ""));

    this.switchPhase(PHASE_AUTO_RESPONSE_TYPING);
  }

  // TODO: Document
  getHistory() {
    return this._history;
  }

  // TODO: Document
  getTotalInteractions() {
    return this._totalInteractions;
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

  // TODO: Gather data structure for rendering
}
