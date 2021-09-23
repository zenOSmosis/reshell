import React, { useCallback, useMemo } from "react";

import ServiceCollection, {
  EVT_CHILD_INSTANCE_ADDED,
  EVT_CHILD_INSTANCE_REMOVED,
} from "./classes/UIServiceCollection";

import useForceUpdate from "@hooks/useForceUpdate";

export const UIServicesContext = React.createContext({});

// TODO: Document
export default function UIServicesProvider({ children }) {
  const forceUpdate = useForceUpdate();

  // const [_uiServiceCollection, _setUIServiceCollection] = useState(null);
  const _uiServiceCollection = useMemo(() => {
    const serviceCollection = new ServiceCollection();

    // Force UI to update when a service has been added or removed
    //
    // IMPORTANT: Collection EVT_UPDATED is not mapped here, and is handled
    // elsewhere, as we don't want the entire UI to update every time
    const _handleServiceAddedOrRemoved = () => {
      // IMPORTANT: This timeout is to prevent trying to re-render while a
      // child component is being updated (i.e. WindowManager currently is
      // instantiating services during the render cycle)
      setTimeout(() => {
        forceUpdate();
      });
    };

    serviceCollection.on(
      EVT_CHILD_INSTANCE_ADDED,
      _handleServiceAddedOrRemoved
    );

    serviceCollection.on(
      EVT_CHILD_INSTANCE_REMOVED,
      _handleServiceAddedOrRemoved
    );

    return serviceCollection;
  }, [forceUpdate]);

  // TODO: Document
  const startService = useCallback(
    ServiceClass => _uiServiceCollection.addServiceClass(ServiceClass),
    [_uiServiceCollection]
  );

  // TODO: Document
  const stopService = useCallback(
    ServiceClass => {
      const serviceInstance =
        _uiServiceCollection.getServiceInstance(ServiceClass);

      if (serviceInstance) {
        return serviceInstance.destroy();
      }
    },
    [_uiServiceCollection]
  );

  return (
    <UIServicesContext.Provider
      value={{
        services: _uiServiceCollection && _uiServiceCollection.getChildren(),
        startService,
        stopService,
      }}
    >
      {
        // TODO: For services which contain internal providers, render those providers here, wrapping the children with them
      }
      {children}
    </UIServicesContext.Provider>
  );
}
