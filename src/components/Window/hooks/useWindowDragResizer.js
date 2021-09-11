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

  const handleBorderDrag = useCallback(
    (direction, { mx, my, isDragging }) => {
      if (isDragging) {
        if (!refInitialDragSizePosition.current) {
          refInitialDragSizePosition.current = {
            ...windowController.getSize(),
            ...windowController.getPosition(),
          };
        }

        let width,
          height,
          x,
          y = null;

        switch (direction) {
          case DIR_BORDER_NW:
            width = refInitialDragSizePosition.current.width - mx;
            height = refInitialDragSizePosition.current.height - my;
            windowController.setSize({ width, height });

            x = refInitialDragSizePosition.current.x + mx;
            y = refInitialDragSizePosition.current.y + my;
            windowController.setPosition({ x, y });
            break;

          case DIR_BORDER_N:
            height = refInitialDragSizePosition.current.height - my;
            windowController.setSize({ height });

            y = refInitialDragSizePosition.current.y + my;
            windowController.setPosition({ y });
            break;

          case DIR_BORDER_NE:
            height = refInitialDragSizePosition.current.height - my;
            width = refInitialDragSizePosition.current.width + mx;
            windowController.setSize({ width, height });

            y = refInitialDragSizePosition.current.y + my;
            windowController.setPosition({ y });
            break;

          case DIR_BORDER_E:
            width = refInitialDragSizePosition.current.width + mx;
            windowController.setSize({ width });
            break;

          case DIR_BORDER_SE:
            width = refInitialDragSizePosition.current.width + mx;
            height = refInitialDragSizePosition.current.height + my;
            windowController.setSize({ width, height });
            break;

          case DIR_BORDER_S:
            height = refInitialDragSizePosition.current.height + my;
            windowController.setSize({ height });
            break;

          case DIR_BORDER_SW:
            width = refInitialDragSizePosition.current.width - mx;
            height = refInitialDragSizePosition.current.height + my;
            windowController.setSize({ width, height });

            x = refInitialDragSizePosition.current.x + mx;
            windowController.setPosition({ x });
            break;

          case DIR_BORDER_W:
            width = refInitialDragSizePosition.current.width - mx;
            windowController.setSize({ width });

            x = refInitialDragSizePosition.current.x + mx;
            windowController.setPosition({ x });
            break;

          default:
            throw new ReferenceError(`Unknown direction: ${direction}`);
        }
      } else {
        refInitialDragSizePosition.current = null;
      }
    },
    [windowController]
  );

  return handleBorderDrag;
}
