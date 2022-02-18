import { useCallback, useRef, useState } from "react";
import { diff } from "deep-object-diff";

// FIXME: (jh) See other implementation here (might be more performant; search
// for useObjectState): https://thoughtspile.github.io/2021/10/11/usestate-object-vs-multiple/?utm_campaign=thisweekinreact&utm_medium=email&utm_source=Revue%20newsletter

/**
 * Applies a shallow-merge strategy to object updates so that setState() calls
 * don't completely overwrite previous object state.
 *
 * Maintains backwards-compatibility for class-based components which have been
 * migrated to hook versions, without having to write a bunch of useState
 * references for every state property.
 *
 * NOTE: This will perform a deep-equality, non-referential check after pre-
 * merging state updates and only update the state if there is a difference in
 * the deep-equality comparison.
 *
 * @param {Object} initialState
 * @return {[state: Object, setState: Function]} Merged state
 */
export default function useObjectState(initialState = {}) {
  const [state, _setMergedState] = useState(initialState);

  const refState = useRef(state);
  refState.current = state;

  /**
   * @param {Object | string | Function} updatedState If passed as a string, it will try
   * to JSON parse into an object.
   * @return {void}
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
        // i.e. setState(prevState => nextState)
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

    _setMergedState(prevState => {
      const nextState = { ...prevState, ...updatedState };

      if (Object.keys(diff(prevState, nextState)).length) {
        // There is a difference in values; update the next state
        return nextState;
      } else {
        // Skip rendering if there is no difference in values. This relies on
        // the React principle that "if your update function returns the exact
        // same value as the current state, the subsequent rerender will be
        // skipped completely."
        // @see https://reactjs.org/docs/hooks-reference.html#usestate
        return prevState;
      }
    });
  }, []);

  return [state, setState];
}
