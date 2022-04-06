import { useEffect } from "react";
import startupServiceClasses from "../../../startupServiceClasses";

// TODO: Document
export default function useUIServicesAutoStart(startServiceClass) {
  useEffect(() => {
    if (startServiceClass) {
      for (const serviceClass of startupServiceClasses) {
        startServiceClass(serviceClass);
      }
    }
  }, [startServiceClass]);
}
