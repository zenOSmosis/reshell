import { PhantomCollection } from "phantom-core";

export default class SpeechRecognizerCollection extends PhantomCollection {
  constructor(...args) {
    super(...args);

    this.registerCleanupHandler(() => this.destroyAllChildren());
  }

  addChild(SpeechRecognizerClass) {
    // TODO: Check for class instance before trying to instantiate it (even better would be to make this collection do the validation internally with some sort of config option)

    const speechRecognizerClass = new SpeechRecognizerClass();

    return super.addChild(speechRecognizerClass);
  }

  // TODO: Document
  addSpeechRecognizerClass(SpeechRecognizerClass) {
    return this.addChild(SpeechRecognizerClass);
  }

  // TODO: Document
  getSpeechRecognizers() {
    return this.getChildren();
  }
}
