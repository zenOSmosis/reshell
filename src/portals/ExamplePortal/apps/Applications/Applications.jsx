import { useMemo } from "react";
import Center from "@components/Center";
import LED from "@components/LED";

import useAppRegistrationsContext from "@hooks/useAppRegistrationsContext";
import useAppRuntimesContext from "@hooks/useAppRuntimesContext";

import consume from "@utils/consume";

const Applications = {
  id: "applications",
  title: "Applications",
  style: {
    width: 640,
    height: 400,
  },
  isPinnedToDock: true,
  // serviceClasses: [],
  view: function View({ windowController, appServices }) {
    const { appRegistrations } = useAppRegistrationsContext();
    const { appRuntimes, startAppRuntime } = useAppRuntimesContext();

    const appRuntimeRegistrations = useMemo(
      () => appRuntimes.map(runtime => runtime.getRegistration()),
      [appRuntimes]
    );

    return (
      <Center canOverflow={true}>
        {appRegistrations.map(registration => {
          // const isRunning = appRuntimeRegistrations.includes(registration);
          const totalInstances = appRuntimeRegistrations.filter(
            predicate => predicate === registration
          ).length;

          return (
            <button
              key={registration.getUUID()}
              style={{
                width: 100,
                height: 100,
                overflow: "none",
                backgroundColor: "transparent",
                borderColor: totalInstances > 0 ? "green" : "",
              }}
              onClick={() => startAppRuntime(registration)}
            >
              {registration.getTitle()}
              <div style={{ position: "absolute", bottom: 0, right: 0 }}>
                {[...new Array(totalInstances)].map((nonUsed, idx) => {
                  consume(nonUsed);

                  return (
                    <LED
                      key={idx}
                      color={totalInstances > 0 ? "green" : "gray"}
                      style={{ margin: "0px 2px" }}
                    />
                  );
                })}
              </div>
            </button>
          );
        })}
      </Center>
    );
  },
};

export default Applications;
