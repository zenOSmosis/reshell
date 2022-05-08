import PhantomCore, { EVT_UPDATED, getUnixTime } from "phantom-core";

import { RANDOM_LEADING_EDGE } from "../phrases";

export { EVT_UPDATED };

const EVT_CHAR_INPUT = "text-input";

// TODO: Document
export default class DrReShellSession extends PhantomCore {
  constructor() {
    super();

    this._lastTextInputTime = null;

    // TODO: Handle text input timeout

    this._history = [];
  }

  // TODO: Process input
  // TODO: Don't just accept finalized input so that we can determine if the user is asleep
  processCharInput(char) {
    this._lastTextInputTime = getUnixTime();

    this.emit(EVT_CHAR_INPUT, char);
  }

  // TODO: Document
  processText(textInput) {
    // TODO: Only push if finalized
    this._history.push(textInput);

    // Update the UI
    this.emit(EVT_UPDATED);

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
