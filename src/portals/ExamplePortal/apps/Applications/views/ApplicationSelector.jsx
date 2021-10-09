import { useMemo } from "react";
import Center from "@components/Center";
import LED from "@components/LED";

import useAppRegistrationsContext from "@hooks/useAppRegistrationsContext";
import useAppRuntimesContext from "@hooks/useAppRuntimesContext";

import consume from "@utils/consume";

export default function ApplicationSelector({ searchQuery = "" }) {
  const { appRegistrations } = useAppRegistrationsContext();
  const { appRuntimes, startAppRuntime } = useAppRuntimesContext();

  const appRuntimeRegistrations = useMemo(
    () => appRuntimes.map(runtime => runtime.getRegistration()),
    [appRuntimes]
  );

  return (
    <Center canOverflow={true}>
      {appRegistrations
        .filter(registration =>
          !searchQuery
            ? true
            : registration
                .getTitle()
                .toUpperCase()
                .includes(searchQuery.toUpperCase())
        )
        .map(registration => {
          // const isRunning = appRuntimeRegistrations.includes(registration);
          const totalInstances = appRuntimeRegistrations.filter(
            predicate => predicate === registration
          ).length;

          return (
            <button
              key={registration.getUUID()}
              // TODO: Extract to module.css
              style={{
                width: 100,
                height: 100,
                overflow: "hidden",
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
                      // TODO: Extract to module.css
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
}
