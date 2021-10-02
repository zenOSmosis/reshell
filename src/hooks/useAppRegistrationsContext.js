import { useContext } from "react";
import { AppRegistrationsContext } from "@core/BaseView/providers/AppRegistrationsProvider";

// TODO: Move to @core/hooks

export default function useAppRegistrationsContext() {
  return useContext(AppRegistrationsContext);
}
