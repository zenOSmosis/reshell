import { useContext } from "react";
import { WindowContext } from "../Window.Provider";

// TODO: Document (per-window useWindowContext)
export default function useWindowContext() {
  return useContext(WindowContext);
}
