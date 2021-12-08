import { useCallback } from "react";
import Padding from "@components/Padding";
import InputMediaDevicesSelector from "@components/InputMediaDevicesSelector";
import SystemModal from "../SystemModal";

// TODO: Add prop-types
export default function InputDeviceSelectorModal({
  onDeviceCapture,
  onDeviceUncapture,
  // onCancel,
  onClose,
}) {
  const handleDeviceCapture = useCallback(() => {
    onDeviceCapture();

    onClose();
  }, [onDeviceCapture, onClose]);

  /*
  const handleCancel = useCallback(() => {
    onCancel();

    onClose();
  }, [onCancel, onClose]);
  */

  return (
    <SystemModal onClose={onClose}>
      <Padding>
        <InputMediaDevicesSelector
          onDeviceCapture={handleDeviceCapture}
          onDeviceUncapture={onDeviceUncapture}
        />
      </Padding>
    </SystemModal>
  );
}
