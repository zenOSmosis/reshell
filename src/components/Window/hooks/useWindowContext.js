import { useContext } from "react";
import { WindowContext } from "../Window.Provider";

export default function useWindowContext() {
  return useContext(WindowContext);
}
