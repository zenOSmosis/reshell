import { useState } from "react";
import useAnimation from "@hooks/useAnimation";

// TODO: Document
export default function useWindowAnimation(el) {
  //const [phase, setPhase] = useState("transition-in");

  const [isHidden, setIsHidden] = useState(true);

  // Window opening transition
  useAnimation({
    domElement: el,
    animationName: "zoomInUp",
    shouldRun: Boolean(el),
    onAnimationEnd: () => setIsHidden(false),
  });

  return { isHidden };
}
