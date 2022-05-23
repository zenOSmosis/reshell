import { useCallback } from "react";

/**
 * Handles window control binding for the given window.
 *
 * @typedef { import('../classesWindowController').default} WindowController
 *
 * @param {{ windowController: WindowController }} options
 * @return {{ onRestoreOrMaximize: Function, onMinimize: Function, onClose: Function}}
 */
export default function useWindowControls({ windowController }) {
  /**
   * Handles toggling of window restore or maximize, depending on current
   * state.
   *
   * @return {void}
   */
  const handleRestoreOrMaximize = useCallback(() => {
    if (windowController.getIsMaximized()) {
      windowController.restore();
    } else {
      windowController.maximize();
    }
  }, [windowController]);

  /**
   * Handles minimizing of the window.
   *
   * @return {void}
   */
  const handleMinimize = useCallback(() => {
    windowController.minimize();
  }, [windowController]);

  /**
   * Handles closing of the window.
   *
   * @return {void}
   */
  const handleClose = useCallback(() => {
    if (!windowController.UNSAFE_getIsDestroying()) {
      windowController.destroy();
    }
  }, [windowController]);

  return {
    onRestoreOrMaximize: handleRestoreOrMaximize,
    onMinimize: handleMinimize,
    onClose: handleClose,
  };
}
