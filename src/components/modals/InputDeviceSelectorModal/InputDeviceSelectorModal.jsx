import { useCallback } from "react";
import Full from "@components/Full";
import Center from "@components/Center";

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
    <Full style={{ backgroundColor: "rgba(0,0,0,.4)" }}>
      <Center>
        <div>
          <button onClick={handleDeviceCapture}>onDeviceCapture</button>
          <button onClick={handleCancel}>onCancel</button>
        </div>
      </Center>
    </Full>
  );
}
