import React, { useCallback, useEffect, useState } from "react";

import ServiceCollection from "./classes/UIServiceCollection";

export const UIServicesContext = React.createContext({});

export default function UIServicesProvider({ children }) {
  const [_uiServiceCollection, _setUIServiceCollection] = useState(null);

  useEffect(() => {
    const serviceCollection = new ServiceCollection();

    // TODO: On update force view update

    _setUIServiceCollection(serviceCollection);
  }, []);

  // TODO: Document
  const startServiceDescription = useCallback(
    (service) => _uiServiceCollection.addService(service),
    [_uiServiceCollection]
  );

  // TODO: Document
  const removeServiceWithKey = useCallback(
    (service) => _uiServiceCollection.removeService(service),
    [_uiServiceCollection]
  );

  // TODO: Document

  return (
    <UIServicesContext.Provider
      value={{
        services: _uiServiceCollection && _uiServiceCollection.getChildren(),
        startServiceDescription,
        removeServiceWithKey,
      }}
    >
      {children}
    </UIServicesContext.Provider>
  );
}
