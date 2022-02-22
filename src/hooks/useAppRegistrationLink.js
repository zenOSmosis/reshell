import { useCallback, useMemo } from "react";
// TODO: Refactor
import useAppOrchestrationContext from "./useAppOrchestrationContext";

// TODO: Move to @core/hooks

// FIXME: (jh) Is there any reason to not just use the appDescriptor itself,
// and not the ID?

// TODO: Document
export default function useAppRegistrationLink(appDescriptorID) {
  const { getAppRegistrationTitleWithID, activateAppRegistrationWithID } =
    useAppOrchestrationContext();

  const title = useMemo(
    () => getAppRegistrationTitleWithID(appDescriptorID),
    [getAppRegistrationTitleWithID, appDescriptorID]
  );
  const link = useCallback(
    () => activateAppRegistrationWithID(appDescriptorID),
    [activateAppRegistrationWithID, appDescriptorID]
  );

  return {
    title,
    link,
  };
}
