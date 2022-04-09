import UIServiceCore from "@core/classes/UIServiceCore";

export default class LocalDeviceIdentificationService extends UIServiceCore {
  constructor(...args) {
    super(...args);

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
