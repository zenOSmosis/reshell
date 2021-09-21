import Center from "@components/Center";

import useNotificationsContext from "@hooks/useNotificationsContext";

const NotificationsPrototype = {
  id: "notifications-prototype",
  title: "Notifications Prototype",
  style: {
    left: "auto",
    bottom: 0,
    width: 640,
    height: 480,
  },
  view: function View() {
    const { showNotification } = useNotificationsContext();

    return (
      <Center>
        <button
          onClick={() =>
            showNotification({
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

export default NotificationsPrototype;
