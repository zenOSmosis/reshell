import { useCallback } from "react";
import Padding from "@components/Padding";
import InputMediaDevices from "@components/InputMediaDevices";
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
        <InputMediaDevices
          onDeviceCapture={handleDeviceCapture}
          onDeviceUncapture={onDeviceUncapture}
        />
      </Padding>
    </SystemModal>
  );
}
