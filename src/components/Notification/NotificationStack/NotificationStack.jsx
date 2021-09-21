import React from "react";

import classNames from "classnames";
import styles from "./NotificationStack.module.css";

import Notification from "../Notification";

export default function NotificationStack({
  notifications = [],
  onNotificationClose,
}) {
  // TODO: Remove
  console.log({ notifications });

  return (
    <div className={classNames(styles["notification-stack"])}>
      {notifications.map(({ body, image, onClick, onClose, title, uuid }) => {
        return (
          <div key={uuid}>
            <Notification
              body={body}
              image={image}
              onClick={onClick}
              onClose={() => {
                onNotificationClose(uuid);

                onClose();
              }}
              title={title}
              uuid={uuid}
            />
          </div>
        );
      })}
    </div>
  );
}
