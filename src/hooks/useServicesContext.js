import { useContext } from "react";
import { UIServicesContext } from "../core/providers/UIServicesProvider";

// TODO: Move to @core/hooks

export default function useServicesContext() {
  return useContext(UIServicesContext);
}
