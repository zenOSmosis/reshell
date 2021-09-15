import { useCallback, useEffect, useRef } from "react";
import WindowController, {
  EVT_RESIZED,
} from "@components/Window/classes/WindowController";

/**
 * Handles automatic invocation of AppRegistration view's setResizeHandler when
 * the relevant window resizes.
 *
 * @param {WindowController} windowController
 * @return {function}
 */
export default function useRegistrationViewOnResized(windowController) {
  const refSetResizeHandler = useRef(null);

  /**
   * @param {function | void} setResizeHandler Passed up from AppRegistration view
   * properties.
   */
  const handleResized = useCallback((setResizeHandler) => {
    /**
     * onResized is passed from view, and is executed by the WindowManager when
     * the WindowController emits EVT_RESIZED event.
     */
    refSetResizeHandler.current = setResizeHandler;
  }, []);

  useEffect(() => {
    if (windowController) {
      if (!(windowController instanceof WindowController)) {
        throw new TypeError("windowController is not a WindowController");
      }

      const _handleExecResizedCallback = () => {
        const onResized = refSetResizeHandler.current;

        // AppRegistration view might not set an onResized handler
        if (typeof onResized === "function") {
          onResized();
        }
      };

      windowController.on(EVT_RESIZED, _handleExecResizedCallback);

      return function unmount() {
        windowController.off(EVT_RESIZED, _handleExecResizedCallback);
      };
    }
  }, [windowController]);

  return handleResized;
}
