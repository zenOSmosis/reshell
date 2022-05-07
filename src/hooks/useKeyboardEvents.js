import { useEffect, useMemo } from "react";

const DEFAULT_PROPS = {
  onKeyDown: keyCode => null,
  onKeyUp: keyCode => null,
  onEnter: () => null,
  onEscape: () => null,
  isEnabled: true,
};

// TODO: Optionally grab from domNode from context
/**
 * Binds keyboard event handlers to the given DOM element.
 *
 * IMPORTANT: If domNode is captured via a ref on a React element, the ref
 * should be wired through a useState in the component, and the resulting state
 * be sent here, or it might not work on subsequent calls. This is a known
 * issue when trying to use with multiple iterations of TextInputModal.
 *
 * @param {DOMElement} domNode // TODO: Default to window or document body?
 * @param {Object} props TODO: Document structure
 */
export default function useKeyboardEvents(domNode, props = {}) {
  const { onKeyDown, onKeyUp, onEnter, onEscape, isEnabled } = useMemo(
    () => ({ ...DEFAULT_PROPS, ...props }),
    [props]
  );

  // Handle event binding and unbinding
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

    return () => {
      domNode.removeEventListener("keydown", _handleKeyDown);
      domNode.removeEventListener("keyup", _handleKeyUp);
    };
  }, [domNode, onKeyDown, onKeyUp, onEnter, onEscape, isEnabled]);
}
