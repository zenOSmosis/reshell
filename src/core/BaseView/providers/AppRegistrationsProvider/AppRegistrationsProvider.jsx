import React, { useCallback, useEffect, useState } from "react";
import AppRegistration from "./classes/AppRegistration";
import AppRegistrationCollection, {
  EVT_UPDATED,
} from "./classes/AppRegistrationCollection";

export const AppRegistrationsContext = React.createContext({});

// TODO: Refactor into a service
export default function AppRegistrationsProvider({ children }) {
  const [appRegistrations, _setAppRegistrations] = useState([]);
  const [_appRegistrationCollection, _setAppRegistrationCollection] =
    useState(null);

  // Sync app registrations state with that of internal collection
  useEffect(() => {
    const appCollection = new AppRegistrationCollection();
    _setAppRegistrationCollection(appCollection);

    const _handleAppRegistrationsUpdated = () => {
      _setAppRegistrations(appCollection.getAppRegistrations());
    };

    appCollection.on(EVT_UPDATED, _handleAppRegistrationsUpdated);

    return function unmount() {
      appCollection.destroy();
    };
  }, []);

  // TODO: Document
  const addOrUpdateAppRegistration = useCallback(
    (appDescriptor) => {
      const appRegistration =
        AppRegistration.addOrUpdateAppRegistration(appDescriptor);

      _appRegistrationCollection.addAppRegistration(appRegistration);
    },
    [_appRegistrationCollection]
  );

  // TODO: Document
  const removeAppRegistration = useCallback(
    (appDescriptorOrId) => {
      // NOTE: This should also remove it from the collection
      AppRegistration.removeAppRegistration(appDescriptorOrId);
    },

    []
  );

  return (
    <AppRegistrationsContext.Provider
      value={{
        addOrUpdateAppRegistration,
        removeAppRegistration,
        appRegistrations,
      }}
    >
      {children}
    </AppRegistrationsContext.Provider>
  );
}
