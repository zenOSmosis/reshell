import { useCallback, useEffect, useRef } from "react";

/**
 * Determines whether the connected component or hook is currently in an
 * unmounting state.
 *
 * @return {boolean}
 */
export default function useGetIsUnmounting() {
  const refIsUnmounting = useRef(false);

  useEffect(() => {
    return function unmount() {
      refIsUnmounting.current = true;
    };
  }, []);

  const getIsUnmounting = useCallback(() => refIsUnmounting.current, []);

  return getIsUnmounting;
}
