import { useCallback, useEffect, useRef } from "react";

/**
 * Determines whether the connected component or hook is currently in an
 * unmounting state.
 *
 * Usage:
 *  const getIsUnmounting = useGetIsUnmounting()
 *
 * @return {Function} A stable-referenced handler to determine if unmounting.
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
