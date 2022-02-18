import { useCallback, useEffect, useRef } from "react";

import getElCenterPoint from "@utils/getElCenterPoint";
import getElSize from "@utils/getElSize";

import useWindowOutOfBoundsPositionCorrection from "./useWindowOutOfBoundsPositionCorrection";

import useAppOrchestrationContext from "@hooks/useAppOrchestrationContext";

/**
 * Handles auto-positioning of the given windows.
 *
 * @typedef { import('../../classesWindowController').default} WindowController
 *
 * @param {{elWindow: HTMLElement, elWindowManager: HTMLElement, windowController: WindowController, onInitialAutoPosition?: Function }} options
 * @return {void}
 */
export default function useWindowAutoPositioner({
  elWindow,
  elWindowManager,
  windowController,
  onInitialAutoPosition = () => null,
}) {
  const refOnInitialAutoPosition = useRef(null);
  if (elWindow) {
    refOnInitialAutoPosition.current = onInitialAutoPosition;
  }

  const outOfBoundsCorrectionPosition = useWindowOutOfBoundsPositionCorrection({
    elWindow,
    elWindowManager,
    windowController,
  });

  // Apply auto-position to window if viewport is resized and window is out-of-
  // bounds
  useEffect(() => {
    if (windowController) {
      if (
        outOfBoundsCorrectionPosition.x !== null ||
        outOfBoundsCorrectionPosition.y !== null
      ) {
        const currentPosition = windowController.getPosition();

        const nextPosition = {
          x:
            outOfBoundsCorrectionPosition.x !== null
              ? outOfBoundsCorrectionPosition.x
              : currentPosition.x,
          y:
            outOfBoundsCorrectionPosition.y !== null
              ? outOfBoundsCorrectionPosition.y
              : currentPosition.y,
        };

        windowController.setPosition(nextPosition);
      }
    }
  }, [windowController, outOfBoundsCorrectionPosition]);

  /**
   * Centers the window in relation to the desktop layout.
   *
   * @return {void}
   */
  const handleCenter = useCallback(() => {
    const winManCenter = getElCenterPoint(elWindowManager);
    const winSize = getElSize(elWindow);

    const x = winManCenter.x - winSize.width / 2;
    const y = winManCenter.y - winSize.height / 2;

    windowController.setPosition({
      x,
      y,
    });
  }, [elWindowManager, elWindow, windowController]);

  /**
   * Randomly positions the window within the confines of the desktop layout.
   *
   * @return {void}
   */
  const handleScatter = useCallback(() => {
    if (windowController) {
      const winManSize = getElSize(elWindowManager);
      const winSize = getElSize(elWindow);

      // Randomly position, but try to keep full window in viewport
      const x = Math.floor(Math.random() * (winManSize.width - winSize.width));
      const y = Math.floor(
        Math.random() * (winManSize.height - winSize.height)
      );

      windowController.setPosition({ x, y });
    }
  }, [elWindowManager, elWindow, windowController]);

  // TODO: Refactor; Determine current app runtimes so we can determine if
  // we're going to center or scatter new windows
  const { appRuntimes } = useAppOrchestrationContext();
  const refInitialAppRuntimes = useRef(appRuntimes);

  // Apply initial auto-position
  useEffect(() => {
    if (elWindowManager && elWindow && windowController) {
      // Apply center / scatter handlers to window controller so they can be
      // called externally
      windowController.__INTERNAL__setCenterHandler(handleCenter);
      windowController.__INTERNAL__setScatterHandler(handleScatter);

      // IMPORTANT: This must be called asynchronously or it will not set
      window.requestAnimationFrame(() => {
        // Determine initial window position
        // TODO: Obtain previous value from local storage, or from window
        // registration
        //
        // TODO: Fix issue where opening more than one initial window will not
        // center the first window
        if (refInitialAppRuntimes.current.length < 2) {
          // Center first window
          handleCenter();
        } else {
          // Randomly scatter subsequent windows
          handleScatter();
        }

        // IMPORTANT: This must be called in a subsequent asynchronous call or
        // it may execute before the previous callback (i.e. handleCenter /
        // handleScatter)
        //
        // FIXME: (jh) Use setImmediate instead?
        window.requestAnimationFrame(() => {
          refOnInitialAutoPosition.current();
        });
      });
    }
  }, [
    elWindowManager,
    elWindow,
    windowController,
    handleCenter,
    handleScatter,
  ]);
}
