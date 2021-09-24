import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { NotificationsStack } from "@components/Notification";

export const NotificationsContext = React.createContext({});

// TODO: Document
// TODO: Borrow API logic from https://www.npmjs.com/package/react-notifications
export default function NotificationsProvider({ children }) {
  const [activeNotificationsStack, setActiveNotificationsStack] = useState([]);

  // TODO: Document
  const showNotification = useCallback(
    ({ image, title, body, onClick, onClose = () => null }) => {
      setActiveNotificationsStack(
        // Add new notifications to end of stack
        (prev) => [
          ...prev,
          { image, title, body, uuid: uuidv4(), onClick, onClose },
        ]
      );
    },
    []
  );

  // TODO: Document
  const handleNotificationClose = useCallback((uuid) => {
    setActiveNotificationsStack((prev) =>
      prev.filter(({ uuid: prevUUID, onClose }) => {
        const isKept = uuid !== prevUUID;

        if (!isKept) {
          // Call the onClose handler passed to showNotification
          onClose();
        }

        return isKept;
      })
    );
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        showNotification,
      }}
    >
      {children}

      <NotificationsStack
        notifications={activeNotificationsStack}
        onNotificationClose={handleNotificationClose}
      />
    </NotificationsContext.Provider>
  );
}
