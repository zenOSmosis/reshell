import { useCallback, useMemo } from "react";
// TODO: Refactor
import useAppOrchestrationContext from "./useAppOrchestrationContext";

// TODO: Move to @core/hooks

// FIXME: (jh) Is there any reason to not just use the appDescriptor itself,
// and not the ID?

// TODO: Document
export default function useAppRegistrationLink(appDescriptorID) {
  const { getAppRegistrationTitleWithDescriptorID, activateAppRegistrationID } =
    useAppOrchestrationContext();

  const title = useMemo(
    () => getAppRegistrationTitleWithDescriptorID(appDescriptorID),
    [getAppRegistrationTitleWithDescriptorID, appDescriptorID]
  );
  const link = useCallback(
    () => activateAppRegistrationID(appDescriptorID),
    [activateAppRegistrationID, appDescriptorID]
  );

  return {
    title,
    link,
  };
}
