import { useEffect } from "react";

import useUIParadigm, {
  DESKTOP_PARADIGM,
  MOBILE_PARADIGM,
} from "@hooks/useUIParadigm";

/**
 * Handles auto-sizing of the given window.
 *
 * @typedef { import('../classesWindowController').default} WindowController
 *
 * @param {{ windowController: WindowController }} options
 * @return {void}
 */
export default function useWindowAutoSizer({ windowController }) {
  const { uiParadigm } = useUIParadigm();

  // Apply auto-maximize / restore depending on paradigm
  useEffect(() => {
    if (windowController) {
      if (!windowController.getIsMinimized()) {
        switch (uiParadigm) {
          case MOBILE_PARADIGM:
            // Auto-maximize windows if on mobile
            windowController.maximize();
            break;

          case DESKTOP_PARADIGM:
            // Restore windows if switched to desktop
            windowController.restore();
            break;

          default:
            break;
        }
      }
    }
  }, [windowController, uiParadigm]);
}
