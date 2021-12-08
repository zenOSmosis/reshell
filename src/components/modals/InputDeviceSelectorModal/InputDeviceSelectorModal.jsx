import { useCallback } from "react";
import Center from "@components/Center";
import Padding from "@components/Padding";
import InputMediaDevices from "@components/InputMediaDevices";
import SystemModal from "../SystemModal";

// TODO: Implement and add prop-types
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
    // TODO: Render audio input selector
    <SystemModal onClose={onClose}>
      {/*
        <Center>
        <div>
          <button onClick={handleDeviceCapture}>onDeviceCapture</button>
          <button onClick={handleCancel}>onCancel</button>
        </div>
      </Center>
        */}
      <Padding>
        <InputMediaDevices
          onDeviceCapture={handleDeviceCapture}
          onDeviceUncapture={onDeviceUncapture}
        />
      </Padding>
    </SystemModal>
  );
}
