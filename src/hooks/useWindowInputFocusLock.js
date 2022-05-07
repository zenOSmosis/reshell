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

  useEffect(() => {
    if (isActiveWindowController && elInput) {
      // Note, the setImmediate fixes Firefox not focusing properly
      const handleFocus = () => setImmediate(() => elInput.focus());

      elInput.addEventListener("blur", handleFocus);

      // Automatically start focusing
      handleFocus();

      return () => elInput.removeEventListener("blur", handleFocus);
    }
  }, [isActiveWindowController, elInput]);
}
