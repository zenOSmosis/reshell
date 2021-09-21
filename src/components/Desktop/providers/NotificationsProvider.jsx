import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// TODO: Make this dynamic?
import { NotificationStack } from "@components/Notification";

export const NotificationsContext = React.createContext({});

export default function NotificationsProvider({ children }) {
  const [activeNotificationsStack, setActiveNotificationsStack] = useState([]);

  // TODO: Document
  const showNotification = useCallback(
    ({ image, title, body, onClick, onClose = () => null }) => {
      setActiveNotificationsStack(
        // Push notification to top of stack
        (prev) => [
          { image, title, body, uuid: uuidv4(), onClick, onClose },
          ...prev,
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

      <NotificationStack
        notifications={activeNotificationsStack}
        onNotificationClose={handleNotificationClose}
      />
    </NotificationsContext.Provider>
  );
}
