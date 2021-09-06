import { useContext } from "react";
import { AppRuntimesContext } from "@core/BaseView/providers/AppRuntimesProvider";

export default function useAppRuntimesContext() {
  return useContext(AppRuntimesContext);
}
