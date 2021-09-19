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

  /**
   * Registers, or updates, the given AppRegistration cache.
   *
   * This is used primarily for applications menu population.
   *
   * @param {AppRegistration}
   * @return {void}
   */
  const addOrUpdateAppRegistration = useCallback(
    appDescriptor => {
      const appRegistration =
        AppRegistration.addOrUpdateAppRegistration(appDescriptor);

      _appRegistrationCollection.addAppRegistration(appRegistration);
    },
    [_appRegistrationCollection]
  );

  /**
   * Unregisters the given AppRegistration from the cache.
   *
   * This will remove the application from the applications menu.
   *
   * @param {AppRegistration}
   * @return {void}
   */
  const removeAppRegistration = useCallback(
    appDescriptorOrID => {
      // NOTE: This should also remove it from the collection
      AppRegistration.removeAppRegistration(appDescriptorOrID);
    },

    []
  );

  // TODO: Document
  const getAppRegistrationTitle = useCallback(
    appDescriptorID => {
      const appRegistration = appRegistrations.find(
        predicate => predicate.getID() === appDescriptorID
      );

      if (!appRegistration) {
        console.warn(
          `Could not locate appRegistration with id: ${appDescriptorID}`
        );
      } else {
        return appRegistration.getTitle();
      }
    },
    [appRegistrations]
  );

  return (
    <AppRegistrationsContext.Provider
      value={{
        addOrUpdateAppRegistration,
        removeAppRegistration,
        appRegistrations,
        getAppRegistrationTitle,
      }}
    >
      {children}
    </AppRegistrationsContext.Provider>
  );
}
