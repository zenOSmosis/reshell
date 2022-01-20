import Center from "@components/Center";

import UINotificationService from "@services/UINotificationService";

const NotificationsPrototypeApp = {
  id: "notifications-prototype",
  title: "Notifications Prototype",
  style: {
    width: 640,
    height: 480,
  },
  serviceClasses: [UINotificationService],
  view: function View({ appServices }) {
    const notificationService = appServices[UINotificationService];

    return (
      <Center>
        <button
          onClick={() =>
            // TODO: Borrow API from Apple: https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/DisplayNotifications.html#//apple_ref/doc/uid/TP40016239-CH61-SW1
            notificationService.showNotification({
              title: "Test Notification Title",
              body: new Date().getTime(),
            })
          }
        >
          Generate Test Notification
        </button>
      </Center>
    );
  },
};

export default NotificationsPrototypeApp;
