import { useEffect, useMemo } from "react";

const DEFAULT_PROPS = {
  onKeyDown: keyCode => null,
  onKeyUp: keyCode => null,
  onEnter: () => null,
  onEscape: () => null,
  isEnabled: true,
};

/**
 * Binds keyboard event handlers to the given DOM element.
 * 
 * @param {DOMElement} domNode 
 * @param {Object} props TODO: Document structure
 */
export default function useKeyboardEvents(domNode, props = {}) {
  const { onKeyDown, onKeyUp, onEnter, onEscape, isEnabled } = useMemo(
    () => ({ ...DEFAULT_PROPS, ...props }),
    [props]
  );

  useEffect(() => {
    if (!domNode || !isEnabled) {
      return;
    }

    const _handleKeyDown = evt => {
      // Prevent repeated calls from holding down a key
      if (evt.repeat) {
        return;
      }

      onKeyDown(evt.which);

      switch (evt.which) {
        case 13:
          onEnter();
          break;

        case 27:
          onEscape();
          break;

        default:
          break;
      }
    };

    const _handleKeyUp = evt => {
      evt.preventDefault();

      onKeyUp(evt.which);
    };

    domNode.addEventListener("keydown", _handleKeyDown);
    domNode.addEventListener("keyup", _handleKeyUp);

    return function unmount() {
      domNode.removeEventListener("keydown", _handleKeyDown);
      domNode.removeEventListener("keyup", _handleKeyUp);
    };
  }, [domNode, onKeyDown, onKeyUp, onEnter, onEscape, isEnabled]);
}
