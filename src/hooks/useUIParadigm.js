import useDesktopContext from "./useDesktopContext";

import {
  DESKTOP_PARADIGM,
  MOBILE_PARADIGM,
  AUTO_DETECT_PARADIGM,
} from "@services/UIParadigmService";

export { DESKTOP_PARADIGM, MOBILE_PARADIGM, AUTO_DETECT_PARADIGM };

/**
 * Retrieves the currently detected paradigm.
 *
 * @return {{
 *  uiParadigm: DESKTOP_PARADIGM | MOBILE_PARADIGM,
 *  isUIParadigmAutoSet: boolean,
 *  setStaticUIParadigm: Function
 * }}
 */
export default function useUIParadigm() {
  // NOTE: The desktop context is utilized for this vs. tapping into the
  // UIParadigmService directly in order to prevent excess event emitters from
  // being added to the service. This decision was also made because a paradigm
  // change would typically affect the entire app, and should not happen
  // frequently, so having the entire app re-render per paradigm change is not
  // unreasonable.
  const { uiParadigm, isUIParadigmAutoSet, setStaticUIParadigm } =
    useDesktopContext();

  return {
    uiParadigm,
    isUIParadigmAutoSet,
    setStaticUIParadigm,
  };
}
