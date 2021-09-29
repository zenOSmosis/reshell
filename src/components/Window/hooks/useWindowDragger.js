import { useRef, useState } from "react";
import { useDrag } from "react-use-gesture";

const TOP_THRESHOLD = 0;
const BOTTOM_THRESHOLD = 40;
const LEFT_THRESHOLD = 0;
const RIGHT_THRESHOLD = 0;

// TODO: Document
// TODO: Implement ability to turn off dragging
export default function useWindowDragger({
  windowController,
  elTitlebar,
  isDisabled,
}) {
  const refInitialDragPosition = useRef(null);
  const refInitialWindowManagerSize = useRef(null);

  const [isUserDragging, setIsUserDragging] = useState(false);

  // @see https://use-gesture.netlify.app/docs/#simple-example
  const bind = useDrag(
    ({ down: isDragging, movement: [mx, my], xy, event }) => {
      if (isDisabled) {
        return;
      }

      if (isDragging !== isUserDragging) {
        setIsUserDragging(isDragging);
      }

      if (!elTitlebar.contains(event.target)) {
        return;
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
    }
  );

  return [bind, isUserDragging];
}
