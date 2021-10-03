import { useContext } from "react";
import { AppRuntimesContext } from "@core/BaseView/providers/AppRuntimesProvider";

// TODO: Move to @core/hooks

export default function useAppRuntimesContext() {
  return useContext(AppRuntimesContext);
}
