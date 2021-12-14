import UIServiceCore from "@core/classes/UIServiceCore";
import { v4 as uuidv4 } from "uuid";

export const EVT_NOTIFICATION = "notification";

// TODO: Implement ability to store previous notifications so they can be retrieved

/**
 * Handles management of UI notifications.
 */
export default class UINotificationService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("UI Notification Service");

    this.setState({
      notifications: [],
    });
  }

  // TODO: Document
  // TODO: Borrow API from Apple: https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/DisplayNotifications.html#//apple_ref/doc/uid/TP40016239-CH61-SW1
  showNotification({ image, title, body, onClick, onClose = () => null }) {
    // TODO: Capture notification time

    this.setState({
      // Add new notifications to end of stack
      notifications: [
        ...this.getState().notifications,
        {
          image,
          title,
          body,
          onClick,
          onClose,
          uuid: uuidv4(),
        },
      ],
    });
  }

  // TODO: Document
  closeNotificationWithUUID(uuid) {
    const next = this.getState().notifications.filter(
      ({ uuid: prevUUID, onClose }) => {
        const isKept = uuid !== prevUUID;

        if (!isKept) {
          // Call the onClose handler passed to showNotification
          onClose();
        }

        return isKept;
      }
    );

    this.setState({
      notifications: next,
    });
  }
}
