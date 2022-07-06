import { EVT_UPDATE } from "@core/classes/UIServiceCore";
import { useEffect, useMemo, useState } from "react";
import useServicesContext from "./useServicesContext";

/**
 * @typedef {Object} UseServiceClassReturn
 * @property {PhantomServiceCore} serviceInstance Instantiated
 * PhantomServiceCore extension.
 * @property {Object} serviceState Current state of the instantiated service
 * class.
 * @property {boolean} subscribeToUpdates? [default = true] If true, will re-
 * render the hook when the service emits EVT_UPDATE.
 *
 * @param {PhantomServiceCore} ServiceClass Non-instantiated
 * PhantomServiceCore extension.
 */
export default function useServiceClass(
  ServiceClass,
  subscribeToUpdates = true
) {
  const { startServiceClass } = useServicesContext();

  // Automatically start the service
  const serviceInstance = useMemo(
    () => startServiceClass(ServiceClass),
    [ServiceClass, startServiceClass]
  );

  const [serviceState, setServiceState] = useState({});

  // Bind service EVT_UPDATE events to hook state
  useEffect(() => {
    if (subscribeToUpdates) {
      const _handleServiceUpdate = () => {
        // IMPORTANT: Must set shallow clone of state or attached components may
        // not update
        setServiceState({ ...serviceInstance.getState() });
      };

      // Capture initial state
      _handleServiceUpdate();

      serviceInstance.on(EVT_UPDATE, _handleServiceUpdate);

      return function unmount() {
        serviceInstance.off(EVT_UPDATE, _handleServiceUpdate);
      };
    }
  }, [serviceInstance, subscribeToUpdates]);

  return {
    serviceInstance,
    serviceState,
  };
}
