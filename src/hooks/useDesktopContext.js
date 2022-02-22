import { useContext } from "react";
import { DesktopServiceContext } from "../core/providers/DesktopServiceProvider";

export default function useDesktopContext() {
  return useContext(DesktopServiceContext);
}
