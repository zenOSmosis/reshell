import { useContext } from "react";
import { DesktopContext } from "../core/BaseView/providers/DesktopProvider";

export default function useDesktopContext() {
  return useContext(DesktopContext);
}
