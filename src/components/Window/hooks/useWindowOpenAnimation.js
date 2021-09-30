import { useState } from "react";
import useAnimation from "@hooks/useAnimation";

// TODO: Document
export default function useWindowOpenAnimation(el) {
  //const [phase, setPhase] = useState("transition-in");

  const [isOpenAnimationEnded, _setIsOpenAnimationEnded] = useState(false);

  // Window opening transition
  useAnimation({
    domElement: el,
    animationName: "zoomInUp",
    animationDuration: ".5s",
    shouldRun: Boolean(el),
    onAnimationEnd: () => _setIsOpenAnimationEnded(true),
  });

  return { isOpenAnimationEnded };
}
