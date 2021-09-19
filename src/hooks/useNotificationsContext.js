import { useContext } from "react";
import { NotificationsContext } from "@core/BaseView/providers/NotificationsProvider";

export default function useNotificationsContext() {
  return useContext(NotificationsContext);
}
