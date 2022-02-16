import { useCallback, useEffect, useRef } from "react";
import { debounce } from "debounce";

const DEFAULT_DEBOUNCE_TIME = 100;

/**
 * Calls onChange handler whenever viewport size changes.
 *
 * Note that this does not re-render the component per size change in order to
 * save render cycles / prevent weird effects such as inputs losing focus when
 * mobile software keyboards render.
 *
 * @param {function | any} onChange If a non-functional value is passed the
 * hook will not monitor viewport size
 * @param {number} debounceTime? [default = 100] Minimum number of milliseconds
 * to wait between subsequent onChange callbacks
 */
export default function useViewportSize(
  /**
   * i.e. ({ width, height }) => console.log({width, height})
   */
  onChange,
  debounceTime = DEFAULT_DEBOUNCE_TIME
) {
  const _getViewportSize = useCallback(() => {
    const { innerWidth: width, innerHeight: height } = window;

    return {
      width,
      height,
    };
  }, []);

  // Wrap onChange so we can pass it through the next useEffect without
  // creating a dependency
  const refOnChange = useRef(onChange);
  refOnChange.current = onChange;

  useEffect(() => {
    if (typeof refOnChange.current === "function") {
      const _handleViewportSize = debounce(
        () => {
          const onChange = refOnChange.current;

          const size = _getViewportSize();

          onChange(size);
        },
        debounceTime,
        // Trailing edge
        false
      );

      // Perform initial sync
      _handleViewportSize();

      window.addEventListener("resize", _handleViewportSize);

      return function unmount() {
        window.removeEventListener("resize", _handleViewportSize);
      };
    }
  }, [debounceTime, _getViewportSize]);
}
