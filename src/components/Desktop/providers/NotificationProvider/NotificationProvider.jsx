import React, { useCallback } from "react";

import NotificationStack from "./views/NotificationStack";
import useServiceClass from "@hooks/useServiceClass";
import UINotificationService from "@services/UINotificationService";

export const NotificationContext = React.createContext({});

// TODO: Document
// TODO: Borrow API logic from https://www.npmjs.com/package/react-notifications
export default function NotificationProvider({ children }) {
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
    <NotificationContext.Provider
      value={{
        showNotification,
      }}
    >
      {children}

      <NotificationStack
        notifications={serviceState.notifications}
        onNotificationClose={closeNotificationWithUUID}
      />
    </NotificationContext.Provider>
  );
}
