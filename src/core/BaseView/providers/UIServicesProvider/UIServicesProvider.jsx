import React, { useCallback, useEffect, useState } from "react";

import ServiceCollection, {
  EVT_CHILD_INSTANCE_ADDED,
  EVT_CHILD_INSTANCE_REMOVED,
  EVT_DESTROYED,
} from "./classes/UIServiceCollection";

import useForceUpdate from "../../../../hooks/useForceUpdate";

export const UIServicesContext = React.createContext({});

export default function UIServicesProvider({ children }) {
  const forceUpdate = useForceUpdate();

  const [_uiServiceCollection, _setUIServiceCollection] = useState(null);

  useEffect(() => {
    const serviceCollection = new ServiceCollection();

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
    // TODO: On update force view update

    _setUIServiceCollection(serviceCollection);

    return function unmount() {
      serviceCollection.destroy();
    };
  }, [forceUpdate]);

  // TODO: Document
  const startService = useCallback(
    (serviceClass) => _uiServiceCollection.addServiceClass(serviceClass),
    [_uiServiceCollection]
  );

  // TODO: Document
  /*
  const stopService = useCallback(
    (serviceClass) => _uiServiceCollection.removeService(serviceClass),
    [_uiServiceCollection]
  );
  */

  // TODO: Document

  return (
    <UIServicesContext.Provider
      value={{
        services: _uiServiceCollection && _uiServiceCollection.getChildren(),
        startService,
        // stopService,
      }}
    >
      {children}
    </UIServicesContext.Provider>
  );
}
