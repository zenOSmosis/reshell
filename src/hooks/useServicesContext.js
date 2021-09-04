import { useContext } from "react";
import { UIServicesContext } from "../core/BaseView/providers/UIServicesProvider";

export default function useServicesContext() {
  return useContext(UIServicesContext);
}
