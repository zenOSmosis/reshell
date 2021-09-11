import { useRef } from "react";
import { useDrag } from "react-use-gesture";

// TODO: Document
// TODO: Implement ability to turn off dragging
export default function useWindowDragger({ windowController, elTitlebar }) {
  const refInitialDragPosition = useRef(null);

  // @see https://use-gesture.netlify.app/docs/#simple-example
  const bind = useDrag(({ down: isDragging, movement: [mx, my], event }) => {
    if (!elTitlebar.contains(event.target)) {
      return;
    }

    // TODO: Don't allow dragging out of bounds
    if (isDragging) {
      if (!refInitialDragPosition.current) {
        refInitialDragPosition.current = windowController.getPosition();
      }

      windowController.setPosition({
        x: refInitialDragPosition.current.x + mx,
        y: refInitialDragPosition.current.y + my,
      });
    } else {
      // Reset initial drag position
      refInitialDragPosition.current = null;
    }
  });

  return bind;
}
