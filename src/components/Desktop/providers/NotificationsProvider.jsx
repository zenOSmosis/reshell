import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { NotificationsStack } from "@components/Notification";

export const NotificationsContext = React.createContext({});

// TODO: Document
// TODO: Borrow API logic from https://www.npmjs.com/package/react-notifications
export default function NotificationsProvider({ children }) {
  const [activeNotificationsStack, setActiveNotificationsStack] = useState([]);

  // TODO: Document
  // TODO: Borrow API from Apple: // TODO: Borrow API from Apple: https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/DisplayNotifications.html#//apple_ref/doc/uid/TP40016239-CH61-SW1
  const showNotification = useCallback(
    ({ image, title, body, onClick, onClose = () => null }) => {
      setActiveNotificationsStack(
        // Add new notifications to end of stack
        prev => [
          ...prev,
          { image, title, body, uuid: uuidv4(), onClick, onClose },
        ]
      );
    },
    []
  );

  // TODO: Document
  const handleNotificationClose = useCallback(uuid => {
    setActiveNotificationsStack(prev =>
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
