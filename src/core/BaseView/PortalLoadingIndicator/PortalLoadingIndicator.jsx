import { useEffect, useState } from "react";
import Center from "@components/Center";

export default function PortalLoadingIndicator() {
  return (
    <Center style={{ fontWeight: "bold" }}>
      Loading portal
      <RotatingDots />
    </Center>
  );
}

function RotatingDots() {
  const lenDots = 3;

  const [idxDot, setIdxDot] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIdxDot(prevIdx => (prevIdx + 1 > lenDots ? 0 : ++prevIdx));
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {[...Array(lenDots)].map((nil, idx) => (
        <span key={idx} style={{ opacity: idx <= idxDot ? 0.5 : 1 }}>
          .
        </span>
      ))}
    </>
  );
}
