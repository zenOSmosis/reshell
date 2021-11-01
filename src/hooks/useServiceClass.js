import { EVT_UPDATED } from "@core/classes/UIServiceCore";
import { useEffect, useState } from "react";
import useServicesContext from "./useServicesContext";

// TODO: Document
export default function useServiceClass(ServiceClass) {
  const { startService } = useServicesContext();

  const [serviceInstance, setServiceInstance] = useState(null);
  const [serviceState, setServiceState] = useState({});

  useEffect(() => {
    const serviceInstance = startService(ServiceClass);

    setServiceInstance(serviceInstance);

    const _handleServiceUpdate = () => {
      setServiceState(serviceInstance.getState());
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
