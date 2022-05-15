import UIServiceCore from "@core/classes/UIServiceCore";

// FIXME: Rename to SystemLocaleService?
export default class LocaleService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Locale Service");

    this.setState({
      // FIXME: Make this dynamic
      languageCode: "en-US",
    });
  }

  /**
   * @return {string}
   */
  getLanguageCode() {
    return this.getState().languageCode;
  }
}
