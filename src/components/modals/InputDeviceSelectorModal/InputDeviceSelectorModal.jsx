import { useCallback } from "react";
import Padding from "@components/Padding";
import InputMediaDevicesSelector from "@components/InputMediaDevicesSelector";
import SystemModal from "../SystemModal";

// TODO: Add prop-types
export default function InputDeviceSelectorModal({
  onDeviceCapture,
  onDeviceUncapture,
  onCancel,
  onClose,
}) {
  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/InputDeviceInfo}
   *
   * @param {InputDeviceInfo}
   * @return {void}
   */
  const handleDeviceCapture = useCallback(
    device => {
      onDeviceCapture(device);

      onClose();
    },
    [onDeviceCapture, onClose]
  );

  /*
  const handleCancel = useCallback(() => {
    onCancel();

    onClose();
  }, [onCancel, onClose]);
  */

  return (
    <SystemModal onClose={onClose} onCancel={onCancel}>
      <Padding>
        <InputMediaDevicesSelector
          onDeviceCapture={handleDeviceCapture}
          onDeviceUncapture={onDeviceUncapture}
        />
      </Padding>
    </SystemModal>
  );
}
