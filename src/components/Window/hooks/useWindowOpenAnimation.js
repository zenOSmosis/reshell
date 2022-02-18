import { useState } from "react";
import useAnimation from "@hooks/useAnimation";

// FIXME: (jh) Apply animations to open, close, minimize, maximize, restore,
// etc. Some of these animations are currently handled directly via
// Window.module.css and the functionality could be cleaned up / refactored.
//
// @see https://animate.style/
// @see https://github.com/miniMAC/magic (what is "magic / puffin"?) (TODO: Create test app to try these libs?)
// # mac minimize genie effect warp

/**
 * [Currently only] Handles window opening animation.
 *
 * @param {HTMLElement} elWindow
 * @return {{isOpenAnimationEnded: boolean}}
 */
export default function useWindowOpenAnimation(elWindow) {
  //const [phase, setPhase] = useState("transition-in");

  const [isOpenAnimationEnded, _setIsOpenAnimationEnded] = useState(false);

  // Window opening transition
  useAnimation({
    domElement: elWindow,
    animationName: "zoomInUp",
    animationDuration: ".5s",
    shouldRun: Boolean(elWindow),
    onAnimationEnd: () => _setIsOpenAnimationEnded(true),
  });

  return { isOpenAnimationEnded };
}
