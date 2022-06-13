import { useEffect, useState } from "react";
import useWindowController from "./useWindowController";
import { EVT_RESIZE } from "@components/Window/classes/WindowController";

/**
 * Monitors the size of the containing ReShell window via its React Context.
 *
 * @return {{width: number, height: number}}
 */
export default function useWindowSize() {
  const windowController = useWindowController();
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  // Handle resize event binding
  useEffect(() => {
    if (windowController) {
      const _handleResize = () => {
        // FIXME: This queueMicrotask patches an issue where getSize is not
        // immediately available on the window controller. This may need
        // to be cleaned up.
        queueMicrotask(() => {
          if (!windowController.getHasDestroyStarted()) {
            const windowSize = windowController.getSize();

            setWindowSize(windowSize);
          }
        });
      };

      // Initial sync
      _handleResize();

      windowController.on(EVT_RESIZE, _handleResize);

      return () => {
        windowController.off(EVT_RESIZE, _handleResize);
      };
    }
  }, [windowController]);

  return windowSize;
}
