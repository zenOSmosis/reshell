import UIServiceCore from "@core/classes/UIServiceCore";

import SpeechRecognizerCollection from "./SpeechRecognizerCollection";

/**
 * Maintains a collection of speech recognizers.
 */
export default class SpeechRecognizerRegistrationService extends UIServiceCore {
  // TODO: Enforce non-extendable
  // @see https://github.com/zenOSmosis/phantom-core/issues/149
  /*
  static meta = {
    extendable: false,
  };
  */

  constructor(...args) {
    super(...args);

    this.setTitle("Speech Recognizer Registration Service");

    this._speechRecognizerCollection = this.useCollectionClass(
      SpeechRecognizerCollection
    );
  }

  // TODO: Document
  addSpeechRecognizerServiceClass(SpeechRecognizerClass) {
    this._speechRecognizerCollection.addSpeechRecognizerClass(
      SpeechRecognizerClass
    );
  }

  // TODO: Document
  getSpeechRecognizerServices() {
    return this._speechRecognizerCollection.getChildren();
  }
}
