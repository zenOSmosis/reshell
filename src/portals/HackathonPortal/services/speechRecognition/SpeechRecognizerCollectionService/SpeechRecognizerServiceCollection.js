import { PhantomCollection } from "phantom-core";
import SpeechRecognizerServiceBase, {
  EVT_TRANSCRIPTION_FINALIZED,
} from "../__common__/SpeechRecognizerServiceBase";

/**
 * A collection of speech recognizer service instances.
 */
export default class SpeechRecognizerServiceCollection extends PhantomCollection {
  constructor(...args) {
    super(...args);

    // Destroy all children on cleanup
    this.registerCleanupHandler(() => this.destroyAllChildren());

    this.bindChildEventName(EVT_TRANSCRIPTION_FINALIZED);
  }

  /**
   * Adds a speech recognizer service instance to the collection.
   *
   * @param {SpeechRecognizerServiceBase}
   * @return {void}
   */
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

  /**
   * @alias addChild
   */
  addSpeechRecognizerServiceInstance(speechRecognizerService) {
    return this.addChild(speechRecognizerService);
  }

  /**
   * Retrieves the speech recognizer service instances which are bound to this
   * collection.
   *
   * @return {SpeechRecognizerServiceBase[]}
   */
  getSpeechRecognizerServices() {
    return this.getChildren();
  }
}