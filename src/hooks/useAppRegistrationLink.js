import { useCallback, useMemo } from "react";
import useAppRegistrationsContext from "./useAppRegistrationsContext";
import useAppRuntimesContext from "./useAppRuntimesContext";

// TODO: Move to @core/hooks

// TODO: Document
export default function useAppRegistrationLink(appDescriptorID) {
  const { getAppRegistrationTitle } = useAppRegistrationsContext();
  const { switchToAppRegistrationID } = useAppRuntimesContext();

  const title = useMemo(
    () => getAppRegistrationTitle(appDescriptorID),
    [getAppRegistrationTitle, appDescriptorID]
  );
  const link = useCallback(
    () => switchToAppRegistrationID(appDescriptorID),
    [switchToAppRegistrationID, appDescriptorID]
  );

  return {
    title,
    link,
  };
}
