import PhantomCore, { EVT_UPDATED, getUnixTime } from "phantom-core";

import { RANDOM_LEADING_EDGE } from "../phrases";

export { EVT_UPDATED };

const EVT_TEXT_INPUT = "text-input";

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
  processTextInput(textInput) {
    // TODO: Handle
    console.log({ textInput });

    this._lastTextInputTime = getUnixTime();

    this.emit(EVT_TEXT_INPUT, textInput);

    // TODO: Only push if finalized
    this._history.push(textInput);
    this.emit(EVT_UPDATED);
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
