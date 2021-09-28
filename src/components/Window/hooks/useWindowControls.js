import { useCallback } from "react";

// TODO: Document
export default function useWindowControls(windowController) {
  // TODO: Document
  // TODO: Implement
  const handleRestoreOrMaximize = useCallback(() => {
    alert("TODO: Handle restore or maximize");
  }, []);

  // TODO: Document
  // TODO: Implement
  const handleRestoreOrMinimize = useCallback(() => {
    alert("TODO: Handle restore or minimize");
  }, []);

  // TODO: Document
  // TODO: Implement
  const handleClose = useCallback(() => {
    windowController.destroy();
  }, [windowController]);

  return {
    onRestoreOrMaximize: handleRestoreOrMaximize,
    onRestoreOrMinimize: handleRestoreOrMinimize,
    onClose: handleClose,
  };
}
