import { useContext } from "react";
import { DesktopContext } from "../core/providers/DesktopProvider";

export default function useDesktopContext() {
  return useContext(DesktopContext);
}
