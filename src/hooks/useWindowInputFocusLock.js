import { useEffect } from "react";
import useWindowController from "./useWindowController";

/**
 * Maintains a focus lock on an input element in a window.  If the window is
 * active, the input will stay focused.
 *
 * FIXME: (jh) Include optional ability to disable on mobile.
 *
 * @param {HTMLInputElement | HTMLTextAreaElement} elInput
 * @return {void}
 */
export default function useWindowInputFocusLock(elInput) {
  const windowController = useWindowController();
  const isActiveWindowController = windowController.getIsActive();
  const elWindow = windowController.getElWindow();

  useEffect(() => {
    if (isActiveWindowController && elInput) {
      // Note, the setImmediate fixes Firefox not focusing properly
      const handleFocus = () =>
        setImmediate(() => {
          // Fix issue where menu won't open when focus is locked
          if (
            document.body === document.activeElement ||
            elWindow === document.activeElement ||
            elWindow.contains(document.activeElement)
          ) {
            elInput.focus();
          }
        });

      // Automatically start focusing
      handleFocus();

      elInput.addEventListener("blur", handleFocus, {
        passive: true,
      });
      elWindow.addEventListener("mousedown", handleFocus, {
        passive: true,
      });
      elWindow.addEventListener("touchstart", handleFocus, {
        passive: true,
      });

      return () => {
        elInput.removeEventListener("blur", handleFocus, {
          passive: true,
        });
        elWindow.removeEventListener("mousedown", handleFocus, {
          passive: true,
        });
        elWindow.removeEventListener("touchstart", handleFocus, {
          passive: true,
        });
      };
    }
  }, [isActiveWindowController, windowController, elInput, elWindow]);
}
