import { useContext } from "react";
import { NotificationsContext } from "@components/Desktop/providers/NotificationsProvider";

export default function useNotificationsContext() {
  return useContext(NotificationsContext);
}
