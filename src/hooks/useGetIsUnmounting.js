import { useCallback, useEffect, useRef } from "react";

// TODO: Document
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
