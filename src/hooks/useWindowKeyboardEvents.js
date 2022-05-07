import useKeyboardEvents from "./useKeyboardEvents";
import useWindowController from "./useWindowController";

/**
 * Applies keyboard event monitoring to a given ReShell window.
 *
 * @param {Object} props TODO: Document
 */
export default function useWindowKeyboardEvents(props = {}) {
  const windowController = useWindowController();
  const elWindow = windowController?.getElWindow();

  return useKeyboardEvents(elWindow, props);
}
