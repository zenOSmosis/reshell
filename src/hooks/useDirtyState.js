import { useCallback, useMemo } from "react";
import useObjectState from "./useObjectState";
import objectHash from "object-hash";

/**
 * A savable state wrapper around useObjectState, with the ability to cancel
 * back to previously saved state.
 *
 * @param {Object} initialState?
 * @return {Object} TODO: Document return object
 */
export default function useDirtyState(initialState = {}) {
  /**
   * Saved state.
   *
   * @type {Object}
   */
  const [cleanState, setCleanState] = useObjectState(initialState);

  /**
   * Unsaved state.
   *
   * @type {Object}
   */
  const [dirtyState, setDirtyState] = useObjectState(initialState);

  /**
   * @type {boolean}
   */
  const isDirty = useMemo(() => {
    const isDirty = objectHash(cleanState) !== objectHash(dirtyState);

    return isDirty;
  }, [cleanState, dirtyState]);

  /**
   * Set the clean state to the dirty state.
   */
  const save = useCallback(() => {
    if (isDirty) {
      setCleanState(dirtyState);
    }
  }, [setCleanState, dirtyState, isDirty]);

  /**
   * Revert the dirty state back to the clean state.
   */
  const cancel = useCallback(() => {
    if (isDirty) {
      setDirtyState(cleanState);
    }
  }, [setDirtyState, cleanState, isDirty]);

  return {
    state: dirtyState,
    setState: setDirtyState,

    isDirty,
    save,

    cancel,

    // FIXME: (jh) Could also add cancel (alias of reset)
  };
}
