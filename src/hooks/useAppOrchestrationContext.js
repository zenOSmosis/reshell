import { useContext } from "react";
import { AppOrchestrationServiceContext } from "@core/providers/AppOrchestrationServiceProvider";

export default function useAppOrchestrationContext() {
  return useContext(AppOrchestrationServiceContext);
}
