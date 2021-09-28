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
  const handleMinimize = useCallback(() => {
    alert("TODO: Handle minimize");
  }, []);

  // TODO: Document
  // TODO: Implement
  const handleClose = useCallback(() => {
    windowController.destroy();
  }, [windowController]);

  return {
    onRestoreOrMaximize: handleRestoreOrMaximize,
    onMinimize: handleMinimize,
    onClose: handleClose,
  };
}
