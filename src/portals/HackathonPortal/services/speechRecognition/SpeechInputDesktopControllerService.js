import UIServiceCore from "@core/classes/UIServiceCore";

import DesktopCommanderControllerService, {
  EVT_UPDATED,
} from "@services/DesktopCommanderControllerService";

import SpeechRecognizerCollectionService, {
  EVT_TRANSCRIPTION_FINALIZED,
} from "./SpeechRecognizerCollectionService";

export { EVT_UPDATED };

// TODO: Document
// IMPORTANT: Don't extend DesktopCommanderControllerService
export default class SpeechDesktopControllerService extends UIServiceCore {
  // TODO: Prevent extendable (reference: https://github.com/zenOSmosis/phantom-core/issues/149)

  constructor(...args) {
    super(...args);

    this.setTitle("Speech Input Desktop Controller Service");

    this.setState({
      // Enable by default, though is only active if speech recognition is
      // enabled
      isDesktopControlEnabled: true,
    });

    this._desktopControllerService = this.useServiceClass(
      DesktopCommanderControllerService
    );

    // A proxy to all of the speech recognizer services
    this._speechRecognizerCollectionService = this.useServiceClass(
      SpeechRecognizerCollectionService
    );

    // Handle finalized transcription updates
    this.proxyOn(
      this._speechRecognizerCollectionService,
      EVT_TRANSCRIPTION_FINALIZED,
      text => {
        if (this.getIsDesktopControlEnabled()) {
          this.extractCommandIntentFromText(text);
        }
      }
    );
  }

  /**
   * Sets whether or not the controller should automatically interpret speech
   * commands.
   *
   * @param {boolean} isDesktopControlEnabled
   * @return {void}
   */
  setIsDesktopControlEnabled(isDesktopControlEnabled) {
    this.setState({
      isDesktopControlEnabled: Boolean(isDesktopControlEnabled),
    });
  }

  /**
   * Retrieves whether or not the controller should automatically interpret
   * speech commands.
   *
   * @return {boolean}
   */
  getIsDesktopControlEnabled() {
    // TODO: Return false if speech detection is not active
    return this.getState().isDesktopControlEnabled;
  }

  // TODO: Document
  // FIXME: (jh) This could be more efficient in terms of CPU usage
  // TODO: Process in a web worker?
  async extractCommandIntentFromText(text) {
    // Lower-case and alpha-numeric
    const normalizedText = text.toLowerCase().replace(/[^a-z0-9 ]/gi, "");

    const words = normalizedText.split(" ");

    // Determine potential commands, and assign a "strength" rating; the higher
    // the strength, the most likely it is the relevant command
    const commandStrengths = Object.values(
      this._desktopControllerService.getCommands()
    )
      .map(command => {
        const matchedWords = words.filter(word =>
          command.keywords.includes(word)
        );

        const strength = matchedWords.length;

        return {
          command,
          strength,
        };
      })
      .filter(({ strength }) => strength);

    // Guess the best command, based on the highest strength rating
    const bestMatchCommandStrength = commandStrengths.reduce((a, b) => {
      if (!a || b.strength > a.strength) {
        return b;
      } else if (b.strength === a.strength) {
        // If two strengths are the same, favor the one with the least keywords

        if (b.command.keywords.length < a.command.keywords.length) {
          return b;
        } else {
          return a;
        }
      } else {
        return a;
      }
    }, null);

    if (bestMatchCommandStrength) {
      const command = bestMatchCommandStrength.command;

      await this._desktopControllerService.execCommand(command);
    }
  }
}
