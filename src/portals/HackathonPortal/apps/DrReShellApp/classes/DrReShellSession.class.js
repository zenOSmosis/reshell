import PhantomCore, { EVT_UPDATED, getUnixTime } from "phantom-core";

import { RANDOM_LEADING_EDGE } from "../phrases";

export { EVT_UPDATED };

const EVT_CHAR_INPUT = "text-input";

// TODO: Document
export default class DrReShellSession extends PhantomCore {
  constructor({ posSpeechAnalyzer }) {
    super();

    this._lastTextInputTime = null;

    // TODO: Handle text input timeout

    this._history = [];

    this._posSpeechAnalyzer = posSpeechAnalyzer;
    this.registerCleanupHandler(() => (this._posSpeechAnalyzer = null));
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

    // Update the UI
    this.emit(EVT_UPDATED);

    const [sentiment, partsOfSpeech] = await Promise.all([
      this._posSpeechAnalyzer.fetchSentimentAnalysis(textInput),
      this._posSpeechAnalyzer.fetchPartsOfSpeech(textInput),
    ]);

    // TODO: Remove
    console.log({ sentiment, partsOfSpeech });

    // TODO: Handle text input
  }

  // TODO: Document
  getHistory() {
    return this._history;
  }

  // TODO: Implement
  // TODO: Document
  getResponse() {
    const response =
      RANDOM_LEADING_EDGE[
        Math.floor(Math.random() * RANDOM_LEADING_EDGE.length)
      ];

    return response;
  }

  // TODO: Gather data structure for rendering
}
