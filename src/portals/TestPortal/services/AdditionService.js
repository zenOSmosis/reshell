import UIServiceCore from "@core/classes/UIServiceCore";

export default class AdditionService extends UIServiceCore {
  // TODO: Document
  increment() {
    this.setState({
      value: this.getValue() + 1,
    });
  }

  // TODO: Document
  getValue() {
    return this.getState().value || 0;
  }

  // TODO: Document
  reset() {
    this.setState({ value: 0 });
  }
}
