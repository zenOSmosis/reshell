import { useCallback, useRef } from "react";

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

// TODO: Document
// TODO: Implement ability to turn off dragging
export default function useWindowDragResizer({ windowController }) {
  const refInitialDragSizePosition = useRef(null);
  const refInitialWindowManagerSize = useRef(null);

  const handleBorderDrag = useCallback(
    (direction, { mx, my, isDragging }) => {
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

        let width = refInitialDragSizePosition.current.width;
        let height = refInitialDragSizePosition.current.height;
        let x = refInitialDragSizePosition.current.x;
        let y = refInitialDragSizePosition.current.y;

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
          height = windowManagerHeight - y;
          y = null;
        }

        windowController.setSize({ width, height });
        windowController.setPosition({ x, y });
      } else {
        refInitialDragSizePosition.current = null;
        refInitialWindowManagerSize.current = null;
      }
    },
    [windowController]
  );

  return handleBorderDrag;
}
