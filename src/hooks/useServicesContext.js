import { useContext } from "react";
import { UIServicesContext } from "../core/BaseView/providers/UIServicesProvider";

// TODO: Move to @core/hooks

export default function useServicesContext() {
  return useContext(UIServicesContext);
}
