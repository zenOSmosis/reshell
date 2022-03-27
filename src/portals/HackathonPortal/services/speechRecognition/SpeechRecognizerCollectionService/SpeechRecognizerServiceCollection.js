import { PhantomCollection } from "phantom-core";
import SpeechRecognizerServiceCore, {
  EVT_TRANSCRIPTION_FINALIZED,
} from "../__common__/SpeechRecognizerServiceCore";

/**
 * A collection of speech recognizer service instances.
 */
export default class SpeechRecognizerServiceCollection extends PhantomCollection {
  constructor(...args) {
    super(...args);

    // Destroy all children on cleanup
    this.registerCleanupHandler(() => this.destroyAllChildren());
  }

  /**
   * Adds a speech recognizer service instance to the collection.
   *
   * @param {SpeechRecognizerServiceCore}
   * @return {void}
   */
  addChild(speechRecognizerService) {
    // TODO: Check for class instance before trying to instantiate it (even
    // better would be to make this collection do the validation internally
    // with some sort of config option)

    if (!(speechRecognizerService instanceof SpeechRecognizerServiceCore)) {
      throw new TypeError(
        "speechRecognizerService is not a SpeechRecognizerServiceCore"
      );
    }

    // FIXME: (jh) This proxy is utilized instead of bindChildEventName we want
    // to obtain the service which broadcast the event. This functionality
    // might should work its way into PhantomCore instead.
    this.proxyOn(speechRecognizerService, EVT_TRANSCRIPTION_FINALIZED, data => {
      this.emit(EVT_TRANSCRIPTION_FINALIZED, [speechRecognizerService, data]);
    });

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
   * @return {SpeechRecognizerServiceCore[]}
   */
  getSpeechRecognizerServices() {
    return this.getChildren();
  }
}
