import { useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";

export const TOP_THRESHOLD = 0;
export const BOTTOM_THRESHOLD = 58;
export const LEFT_THRESHOLD = 0;
export const RIGHT_THRESHOLD = 0;

// TODO: Document
export default function useWindowDragger({ windowController, isDisabled }) {
  const refInitialDragPosition = useRef(null);
  const refInitialWindowManagerSize = useRef(null);

  const [isUserDragging, setIsUserDragging] = useState(false);

  // @see https://use-gesture.netlify.app/docs/#simple-example
  const bind = useDrag(
    ({ down: isDragging, movement: [mx, my], xy, event }) => {
      if (isDisabled || event.target.tagName.toUpperCase() === "BUTTON") {
        return;
      }

      if (isDragging !== isUserDragging) {
        setIsUserDragging(isDragging);
      }

      if (isDragging) {
        if (!refInitialDragPosition.current) {
          refInitialDragPosition.current = windowController.getPosition();
        }

        if (!refInitialWindowManagerSize.current) {
          refInitialWindowManagerSize.current =
            windowController.getWindowManagerSize();
        }

        let x = refInitialDragPosition.current.x + mx;
        let y = refInitialDragPosition.current.y + my;

        const initialWindowManagerWidth =
          refInitialWindowManagerSize.current.width;
        const initialWindowManagerHeight =
          refInitialWindowManagerSize.current.height;

        // Prevent window from being dragged above top threshold
        if (y < TOP_THRESHOLD) {
          y = TOP_THRESHOLD;
        }

        // Prevent window from being dragged below bottom threshold
        if (y > initialWindowManagerHeight - BOTTOM_THRESHOLD) {
          y = initialWindowManagerHeight - BOTTOM_THRESHOLD;
        }

        // Prevent window from being dragged left of left threshold
        if (xy[0] < LEFT_THRESHOLD) {
          x = null;
        }

        // Prevent window from being dragged right of right threshold
        if (xy[0] > initialWindowManagerWidth - RIGHT_THRESHOLD) {
          x = null;
        }

        windowController.setPosition({
          x,
          y,
        });
      } else {
        // Reset initial drag position
        refInitialDragPosition.current = null;
        refInitialWindowManagerSize.current = null;
      }
    },
    {
      pointer: {
        // IMPORTANT: This makes use-gesture utilize touch events instead of
        // pointer events and fixes an issue where pointercancel would
        // sometimes be fired on certain Android devices
        touch: true,
      },
    }
  );

  return [bind, isUserDragging];
}
