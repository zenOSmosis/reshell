import useServiceClass from "@hooks/useServiceClass";

import UIParadigmSwitchingService, {
  DESKTOP_PARADIGM,
  MOBILE_PARADIGM,
} from "@services/UIParadigmSwitchingService";

export { DESKTOP_PARADIGM, MOBILE_PARADIGM };

/**
 * @return {DESKTOP_PARADIGM | MOBILE_PARADIGM}
 */
export default function useDesktopParadigm() {
  const { serviceInstance } = useServiceClass(UIParadigmSwitchingService);

  return serviceInstance.getParadigm();
}
