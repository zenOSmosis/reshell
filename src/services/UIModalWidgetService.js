import { consume } from "phantom-core";
import UIServiceCore from "@core/classes/UIServiceCore";

import UIModalService from "@services/UIModalService";

import ConfirmModal from "@components/modals/ConfirmModal";
import InputDeviceSelectorModal from "@components/modals/InputDeviceSelectorModal";
import TextInputModal from "@components/modals/TextInputModal";

// TODO: Rename to UIModalDialogHelperService?
/**
 * An assortment of modals designed for async programmatic usage.
 */
export default class UIModalWidgetService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("UIModal Widget Service");

    this._uiModalService = this.useServiceClass(UIModalService);
  }

  // TODO: Document
  async confirm(text) {
    try {
      await new Promise((resolve, reject) => {
        this._uiModalService.showModal(({ onClose, onCancel, ...rest }) => (
          <ConfirmModal
            text={text}
            onClose={() => {
              resolve();

              onClose();
            }}
            onCancel={() => {
              reject();

              onCancel();
            }}
            {...rest}
          />
        ));
      });

      return true;
    } catch (err) {
      consume(err);

      return false;
    }
  }

  /**
   * Controls a UIModal specifically for input media device selection.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/InputDeviceInfo}
   *
   * @return {Promise<InputDeviceInfo>}
   */
  async showInputMediaDevicesSelectionModal() {
    const selection = await new Promise(resolve =>
      this._uiModalService.showModal(({ ...rest }) => (
        <InputDeviceSelectorModal onDeviceCapture={resolve} {...rest} />
      ))
    );

    return selection;
  }

  // Add a modal to replace window.prompt (possibly extend dialog modal)
  // TODO: Document
  async showTextInputModal({ label }) {
    const value = await new Promise(resolve =>
      this._uiModalService.showModal(({ onClose, ...rest }) => (
        <TextInputModal
          label={label}
          // TODO: Refactor so the onClose handler is called with the value
          onClose={text => {
            onClose();

            resolve(text);
          }}
          {...rest}
        />
      ))
    );

    return value;
  }
}
