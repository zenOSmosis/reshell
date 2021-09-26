import { useCallback, useEffect, useRef } from "react";
import getElCenterPoint from "@utils/getElCenterPoint";
import getElSize from "@utils/getElSize";

// TODO: Document
export default function useWindowAutoPositioner(
  elWindowManager,
  elWindow,
  windowController,
  onInitialAutoPosition = () => null
) {
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

  // Apply initial auto-position
  useEffect(() => {
    if (elWindowManager && elWindow && windowController) {
      // Apply center handler to window controller so it can be called externally
      windowController.__INTERNAL__setCenterHandler(handleCenter);
      windowController.__INTERNAL__setScatterHandler(handleScatter);

      // IMPORTANT: This must be called asynchronously or it will not set
      requestAnimationFrame(() => {
        handleCenter();

        // IMPORTANT: This must be called in a subsequent asynchronous call or
        // it may execute before the previous
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
