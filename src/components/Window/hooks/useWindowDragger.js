import { useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";

import {
  WINDOW_POINTER_DRAG_TOP_THRESHOLD,
  WINDOW_POINTER_DRAG_BOTTOM_THRESHOLD,
  WINDOW_POINTER_DRAG_LEFT_THRESHOLD,
  WINDOW_POINTER_DRAG_RIGHT_THRESHOLD,
} from "./__window_hook_constants__";

/**
 * Handles window drag binding for the given window.
 *
 * @typedef { import('../classesWindowController').default} WindowController
 *
 * @param {{ windowController: WindowController, isDisabled: boolean }} options
 * @return {[bind: Function, isUserDragging: boolean]}
 */
export default function useWindowDragger({ windowController, isDisabled }) {
  const refInitialDragPosition = useRef(null);
  const refInitialWindowManagerSize = useRef(null);

  const [isUserDragging, setIsUserDragging] = useState(false);

  // @see https://use-gesture.netlify.app/docs/#simple-example
  const bind = useDrag(
    ({ down: isDragging, movement: [mx, my], xy, event }) => {
      if (isDisabled) {
        if (isUserDragging) {
          setIsUserDragging(false);
        }
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
        if (y < WINDOW_POINTER_DRAG_TOP_THRESHOLD) {
          y = WINDOW_POINTER_DRAG_TOP_THRESHOLD;
        }

        // Prevent window from being dragged below bottom threshold
        if (
          y >
          initialWindowManagerHeight - WINDOW_POINTER_DRAG_BOTTOM_THRESHOLD
        ) {
          y = initialWindowManagerHeight - WINDOW_POINTER_DRAG_BOTTOM_THRESHOLD;
        }

        // Prevent window from being dragged left of left threshold
        if (xy[0] < WINDOW_POINTER_DRAG_LEFT_THRESHOLD) {
          x = null;
        }

        // Prevent window from being dragged right of right threshold
        if (
          xy[0] >
          initialWindowManagerWidth - WINDOW_POINTER_DRAG_RIGHT_THRESHOLD
        ) {
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
