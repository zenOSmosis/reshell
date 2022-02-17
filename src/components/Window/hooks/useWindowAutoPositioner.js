import { useCallback, useEffect, useRef } from "react";
import getElCenterPoint from "@utils/getElCenterPoint";
import getElSize from "@utils/getElSize";

import useAppOrchestrationContext from "@hooks/useAppOrchestrationContext";
import useDesktopParadigm, {
  DESKTOP_PARADIGM,
  MOBILE_PARADIGM,
} from "@hooks/useDesktopParadigm";

// TODO: Apply auto-position to window if viewport is resized and window is
// out-of-bounds

// TODO: Document
export default function useWindowAutoPositioner(
  elWindowManager,
  elWindow,
  windowController,
  onInitialAutoPosition = () => null
) {
  const desktopParadigm = useDesktopParadigm();

  // Apply auto-maximize / restore depending on paradigm
  useEffect(() => {
    if (windowController) {
      switch (desktopParadigm) {
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
  }, [windowController, desktopParadigm]);

  const refOnInitialAutoPosition = useRef(null);
  if (elWindow) {
    refOnInitialAutoPosition.current = onInitialAutoPosition;
  }

  // TODO: Document
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

  // TODO: Document
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
    // TODO:Implement
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
      requestAnimationFrame(() => {
        // Determine initial window position
        // TODO: Obtain previous value from local storage, or from window
        // registration
        if (refInitialAppRuntimes.current.length < 2) {
          // If first window
          handleCenter();
        } else {
          handleScatter();
        }

        // IMPORTANT: This must be called in a subsequent asynchronous call or
        // it may execute before the previous callback (i.e. handleCenter /
        // handleScatter)
        //
        // FIXME: (jh) Use setImmediate instead?
        requestAnimationFrame(() => {
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