import UIServiceCore from "@core/classes/UIServiceCore";

export default class MultiplicationService extends UIServiceCore {
  // TODO: Document
  increment() {
    this.setValue(this.getValue() * 2);
  }

  // TODO: Document
  setValue(value) {
    this.setState({
      value,
    });
  }
  // TODO: Document
  getValue() {
    return this.getState().value || 1;
  }

  // TODO: Document
  reset() {
    this.setState({ value: 1 });
  }
}
