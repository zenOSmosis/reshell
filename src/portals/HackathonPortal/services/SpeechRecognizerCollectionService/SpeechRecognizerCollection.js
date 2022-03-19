import { PhantomCollection } from "phantom-core";
import SpeechRecognizerServiceBase, {
  EVT_TRANSCRIPTION_FINALIZED,
} from "../__common__/SpeechRecognizerServiceBase";

// TODO: Document
export default class SpeechRecognizerCollection extends PhantomCollection {
  constructor(...args) {
    super(...args);

    this.registerCleanupHandler(() => this.destroyAllChildren());

    this.bindChildEventName(EVT_TRANSCRIPTION_FINALIZED);
  }

  addChild(speechRecognizerService) {
    // TODO: Check for class instance before trying to instantiate it (even
    // better would be to make this collection do the validation internally
    // with some sort of config option)

    if (!(speechRecognizerService instanceof SpeechRecognizerServiceBase)) {
      throw new TypeError(
        "speechRecognizerService is not a SpeechRecognizerServiceBase"
      );
    }

    return super.addChild(speechRecognizerService);
  }

  // TODO: Document
  addSpeechRecognizerServiceInstance(speechRecognizerService) {
    return this.addChild(speechRecognizerService);
  }

  // TODO: Document
  getSpeechRecognizerServices() {
    return this.getChildren();
  }
}
