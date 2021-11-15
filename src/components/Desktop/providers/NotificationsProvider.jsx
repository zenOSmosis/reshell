import React, { useCallback } from "react";

import { NotificationsStack } from "@components/Notification";
import useServiceClass from "@hooks/useServiceClass";
import UINotificationService from "@services/UINotificationService";

export const NotificationsContext = React.createContext({});

// TODO: Document
// TODO: Borrow API logic from https://www.npmjs.com/package/react-notifications
export default function NotificationsProvider({ children }) {
  const { serviceInstance, serviceState } = useServiceClass(
    UINotificationService
  );

  // TODO: Document
  const showNotification = useCallback(
    notification => serviceInstance.showNotification(notification),
    [serviceInstance]
  );

  // TODO: Document
  const closeNotificationWithUUID = useCallback(
    uuid => serviceInstance.closeNotificationWithUUID(uuid),
    [serviceInstance]
  );

  return (
    <NotificationsContext.Provider
      value={{
        showNotification,
      }}
    >
      {children}

      <NotificationsStack
        notifications={serviceState.notifications}
        onNotificationClose={closeNotificationWithUUID}
      />
    </NotificationsContext.Provider>
  );
}
