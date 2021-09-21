import React from "react";

import styles from "./NotificationsStack.module.css";

import Notification from "../Notification";

// TODO: Document
// Handles multiple-rendered notifications
export default function NotificationsStack({
  notifications = [],
  onNotificationClose,
}) {
  return (
    <div className={styles["notifications-stack"]}>
      {
        // NOTE: The inner-wrap enables too many UI notifications to be
        // scrollable
      }
      <div className={styles["inner-wrap"]}>
        {
          // IMPORTANT: onClose is not mapped from the data object because it is
          // handled internally by the provider
          notifications.map(({ body, image, onClick, title, uuid }) => {
            return (
              <div key={uuid}>
                <Notification
                  body={body}
                  image={image}
                  onClick={onClick}
                  title={title}
                  uuid={uuid}
                  onClose={() => onNotificationClose(uuid)}
                />
              </div>
            );
          })
        }
      </div>
    </div>
  );
}
