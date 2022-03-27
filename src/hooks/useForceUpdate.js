import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Usage:
 *  const forceUpdate = useForceUpdate()
 *
 * @return {Function} Force update function, guaranteed to have a stable
 * reference across renders.
 */
export default function useForceUpdate() {
  // Prevent state from trying to be set after unmounted
  const refIsUnmount = useRef(false);
  useEffect(() => {
    refIsUnmount.current = false;

    return function unmount() {
      refIsUnmount.current = true;
    };
  });

  const [, setAlt] = useState(false);

  const forceUpdate = useCallback(() => {
    !refIsUnmount.current && setAlt(alt => !alt);
  }, []);

  return forceUpdate;
}
