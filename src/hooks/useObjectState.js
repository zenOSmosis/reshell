import { useCallback, useRef, useState } from "react";

// TODO: See other implementation here (might be more performant): https://thoughtspile.github.io/2021/10/11/usestate-object-vs-multiple/?utm_campaign=thisweekinreact&utm_medium=email&utm_source=Revue%20newsletter

/**
 * Applies a shallow-merge strategy to object updates so that setState() calls
 * don't completely overwrite previous object state.
 *
 * Maintains backwards-compatibility for class-based components which have been
 * migrated to hook versions, without having to write a bunch of useState
 * references for every state property.
 *
 * @param {Object} initialState
 * @return {[state: Object, setState: function, changeIdx: number]} Merged state
 */
export default function useObjectState(initialState = {}) {
  const [state, _setMergedState] = useState(initialState);

  const refState = useRef(state);
  refState.current = state;

  /**
   * @param {Object | string} updatedState If passed as a string, it will try
   * to JSON parse into an object.
   */
  const setState = useCallback(updatedState => {
    // Check type validity / apply type coercion, etc.
    switch (typeof updatedState) {
      case "string":
        try {
          updatedState = JSON.parse(updatedState);
        } catch (err) {
          console.error(
            "Unable to parse string into JSON.  Did you forget to use an Object when setting object state?"
          );

          throw err;
        }
        break;

      case "function":
        updatedState = updatedState(refState.current);
        break;

      case "object":
        // Objects are okay the way they are
        break;

      default:
        throw new TypeError(
          `Unhandled useObjectState type: ${typeof updatedState}`
        );
    }

    return _setMergedState(prevState => ({ ...prevState, ...updatedState }));
  }, []);

  return [state, setState];
}
