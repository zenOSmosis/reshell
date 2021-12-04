import { useCallback } from "react";
// import Center from "@components/Center";
import InputMediaDevices from "@components/InputMediaDevices";
import SystemModal from "../SystemModal";

// TODO: Implement and add prop-types
export default function InputDeviceSelectorModal({
  onDeviceCapture,
  onCancel,
  onClose,
}) {
  const handleDeviceCapture = useCallback(() => {
    onDeviceCapture();

    onClose();
  }, [onDeviceCapture, onClose]);

  const handleCancel = useCallback(() => {
    onCancel();

    onClose();
  }, [onCancel, onClose]);

  return (
    // TODO: Render audio input selector
    <SystemModal>
      {/*
        <Center>
        <div>
          <button onClick={handleDeviceCapture}>onDeviceCapture</button>
          <button onClick={handleCancel}>onCancel</button>
        </div>
      </Center>
        */}
      <InputMediaDevices />
    </SystemModal>
  );
}
