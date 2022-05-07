import { useContext } from "react";

import { WindowContext } from "@components/Window/Window.Provider";

/**
 * Retrieves the window controller in the current context.
 *
 * @typedef {import('@components/Window/classes/WindowController')} WindowController
 *
 * @return {WindowController}
 */
export default function useWindowController() {
  const { windowController } = useContext(WindowContext);

  return windowController;
}
