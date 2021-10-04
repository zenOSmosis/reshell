import { useState } from "react";
import useAnimation from "@hooks/useAnimation";

// TODO: Apply animations to open, close, minimize, maximize, restore, etc.
// @see https://animate.style/
// @see https://github.com/miniMAC/magic (what is "magic / puffin"?) (TODO: Create test app to try these libs?)
// # mac minimize genie effect warp

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
