import { useContext } from "react";
import { AppOrchestrationContext } from "@core/providers/AppOrchestrationProvider";

export default function useAppOrchestrationContext() {
  return useContext(AppOrchestrationContext);
}
