import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Grabs the app registration ID from the current React Router location.
 *
 * @return {string | void}
 */
export default function useLocationAppRegistrationID() {
  const location = useLocation();

  const [appRegistrationID, setAppRegistrationID] = useState(null);

  useEffect(() => {
    // Remove leading forward slash (/) from location
    const appRegistrationID = location.pathname?.substring(1);

    setAppRegistrationID(appRegistrationID);
  }, [location]);

  return appRegistrationID;
}
