import { useCallback, useEffect, useRef } from "react";
import getElCenterPoint from "@utils/getElCenterPoint";
import getElSize from "@utils/getElSize";

// TODO: Document
export default function useAutoPositioner(
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

    const posX = winManCenter.x - winSize.width / 2;
    const posY = winManCenter.y - winSize.height / 2;

    windowController.setPosition({
      x: posX,
      y: posY,
    });
  }, [elWindowManager, elWindow, windowController]);

  // Apply initial auto-position
  useEffect(() => {
    if (elWindowManager && elWindow && windowController) {
      // Apply center handler to window controller so it can be called externally
      windowController.__INTERNAL__setCenterHandler(handleCenter);

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
  }, [elWindowManager, elWindow, windowController, handleCenter]);
}
