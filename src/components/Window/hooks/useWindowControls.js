import { useCallback } from "react";

// TODO: Document
export default function useWindowControls(windowController) {
  // TODO: Document
  // TODO: Implement
  const handleRestoreOrMaximize = useCallback(() => {
    if (windowController.getIsMaximized()) {
      windowController.restore();
    } else {
      windowController.maximize();
    }
  }, [windowController]);

  // TODO: Document
  // TODO: Implement
  const handleMinimize = useCallback(() => {
    windowController.minimize();
  }, [windowController]);

  // TODO: Document
  // TODO: Implement
  const handleClose = useCallback(() => {
    if (!windowController.getIsDestroying()) {
      windowController.destroy();
    }
  }, [windowController]);

  return {
    onRestoreOrMaximize: handleRestoreOrMaximize,
    onMinimize: handleMinimize,
    onClose: handleClose,
  };
}
