import { useState } from "react";
import useAnimation from "@hooks/useAnimation";

// TODO: Document
export default function useWindowAnimation(el) {
  //const [phase, setPhase] = useState("transition-in");

  const [isReady, setIsReady] = useState(false);

  // Window opening transition
  useAnimation({
    domElement: el,
    animationName: "zoomInUp",
    shouldRun: Boolean(el),
    onAnimationEnd: () => setIsReady(true),
  });

  return { isReady };
}
