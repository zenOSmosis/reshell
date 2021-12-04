import { EVT_UPDATED } from "@core/classes/UIServiceCore";
import { useEffect, useState } from "react";
import useServicesContext from "./useServicesContext";

/**
 * @typedef {Object} UseServiceClassReturn
 * @property {PhantomServiceCore} serviceInstance Instantiated
 * PhantomServiceCore extension.
 * @property {Object} serviceState Current state of the instantiated service
 * class.
 *
 * @param {PhantomServiceCore} ServiceClass Non-instantiated
 * PhantomServiceCore extension.
 */
export default function useServiceClass(ServiceClass) {
  const { startService } = useServicesContext();

  const [serviceInstance, setServiceInstance] = useState(null);
  const [serviceState, setServiceState] = useState({});

  useEffect(() => {
    const serviceInstance = startService(ServiceClass);

    setServiceInstance(serviceInstance);

    const _handleServiceUpdate = () => {
      // IMPORTANT: Must set shallow clone of state or attached components may
      // not update
      setServiceState({ ...serviceInstance.getState() });
    };

    serviceInstance.on(EVT_UPDATED, _handleServiceUpdate);

    return function unmount() {
      serviceInstance.off(EVT_UPDATED, _handleServiceUpdate);
    };
  }, [ServiceClass, startService]);

  return {
    serviceInstance,
    serviceState,
  };
}
