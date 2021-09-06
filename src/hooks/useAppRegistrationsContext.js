import { useContext } from "react";
import { AppRegistrationsContext } from "@core/BaseView/providers/AppRegistrationsProvider";

export default function useAppRegistrationsContext() {
  return useContext(AppRegistrationsContext);
}
