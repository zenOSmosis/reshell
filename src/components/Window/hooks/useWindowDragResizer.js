import { useCallback, useRef, useState } from "react";

import {
  DIR_BORDER_NW,
  DIR_BORDER_N,
  DIR_BORDER_NE,
  DIR_BORDER_E,
  DIR_BORDER_SE,
  DIR_BORDER_S,
  DIR_BORDER_SW,
  DIR_BORDER_W,
} from "../Window.Border";

import { WINDOW_POINTER_DRAG_BOTTOM_THRESHOLD } from "./__window_hook_constants__";

// FIXME: (jh) Implement ability to disable drag resizing
/**
 * Handles window border drag resize binding for the given window.
 *
 * @typedef { import('../classesWindowController').default} WindowController
 *
 * @param {{ windowController: WindowController }} options
 * @return {[handleBorderDrag: Function, isUserResizing: boolean]}
 */
export default function useWindowDragResizer({ windowController }) {
  const refInitialDragSizePosition = useRef(null);
  const refInitialWindowManagerSize = useRef(null);

  const [isUserResizing, setIsUserResizing] = useState(false);

  const handleBorderDrag = useCallback(
    (direction, { mx, my, isDragging }) => {
      if (isDragging !== isUserResizing) {
        setIsUserResizing(isDragging);
      }

      if (isDragging) {
        if (!refInitialDragSizePosition.current) {
          refInitialDragSizePosition.current = {
            ...windowController.getSize(),
            ...windowController.getPosition(),
          };
        }

        if (!refInitialWindowManagerSize.current) {
          refInitialWindowManagerSize.current =
            windowController.getWindowManagerSize();
        }

        let { width, height, x, y } = refInitialDragSizePosition.current;

        let windowManagerWidth = refInitialWindowManagerSize.current.width;
        let windowManagerHeight = refInitialWindowManagerSize.current.height;

        switch (direction) {
          case DIR_BORDER_NW:
            width = width - mx;
            height = height - my;

            x = x + mx;
            y = y + my;

            break;

          case DIR_BORDER_N:
            height = height - my;
            y = y + my;
            break;

          case DIR_BORDER_NE:
            height = height - my;
            width = width + mx;

            y = y + my;
            break;

          case DIR_BORDER_E:
            width = width + mx;
            break;

          case DIR_BORDER_SE:
            width = width + mx;
            height = height + my;
            break;

          case DIR_BORDER_S:
            height = height + my;
            break;

          case DIR_BORDER_SW:
            width = width - mx;
            height = height + my;

            x = x + mx;
            break;

          case DIR_BORDER_W:
            width = width - mx;

            x = x + mx;
            break;

          default:
            throw new ReferenceError(`Unknown direction: ${direction}`);
        }

        // TODO: Handle min width / height

        // Prevent left resize from extending left of left threshold
        if (x < 0) {
          // This affects window height calculations when cursor is left of
          // left threshold
          const diffX = 0 - x;
          x = 0;
          width = width - diffX;
        }

        // Prevent top resize from extending above top threshold
        if (y < 0) {
          // IMPORTANT: Order of operations is important here; diffY comes
          // before y
          const diffY = 0 - y;
          y = 0;
          height = height - diffY;
        }

        // Prevent right resize from extending right of right threshold
        if (width + x > windowManagerWidth) {
          width = windowManagerWidth - x;
          x = null;
        }

        // Prevent bottom resize from extending below bottom threshold
        if (height + y > windowManagerHeight) {
          if (
            // Fix issue where resizing windows from the top, which extended
            // below the bottom threshold, would move the bottom edge up
            direction === DIR_BORDER_S ||
            direction === DIR_BORDER_SE ||
            direction === DIR_BORDER_SW
          ) {
            height = windowManagerHeight - y;
            y = null;
          }
        }

        // Prevent drags from the top to be able to drag below bottom threshold
        if (windowManagerHeight - y < WINDOW_POINTER_DRAG_BOTTOM_THRESHOLD) {
          return;
        }

        windowController.setSize({ width, height });
        windowController.setPosition({ x, y });
      } else {
        refInitialDragSizePosition.current = null;
        refInitialWindowManagerSize.current = null;
      }
    },
    [windowController, isUserResizing]
  );

  return [handleBorderDrag, isUserResizing];
}
