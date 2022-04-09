import UIServiceCore from "@core/classes/UIServiceCore";

export default class LocaleService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Locale Service");

    this.setState({
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
