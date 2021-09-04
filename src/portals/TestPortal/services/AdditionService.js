import UIServiceCore from "@core/classes/UIServiceCore";

export default class AdditionService extends UIServiceCore {
  // TODO: Document
  increment() {
    this.setValue(this.getValue() + 1);
  }

  // TODO: Document
  setValue(value) {
    this.setState({
      value,
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
