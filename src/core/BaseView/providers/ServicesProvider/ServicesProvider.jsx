import React, { useCallback, useEffect, useState } from "react";

import ServiceCollection from "./classes/ServiceCollection";

export const ServicesContext = React.createContext({});

export default function ServicesProvider({ children }) {
  const [_serviceCollection, _setServiceCollection] = useState(null);

  useEffect(() => {
    const serviceCollection = new ServiceCollection();

    // TODO: On update force view update

    _setServiceCollection(serviceCollection);
  }, []);

  // TODO: Document
  const startServiceDescription = useCallback(
    (service) => _serviceCollection.addService(service),
    [_serviceCollection]
  );

  // TODO: Document
  const removeServiceWithKey = useCallback(
    (service) => _serviceCollection.removeService(service),
    [_serviceCollection]
  );

  // TODO: Document

  return (
    <ServicesContext.Provider
      value={{
        services,
        startServiceDescription,
        removeServiceWithKey,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
}
