import { useMemo } from "react";
import Center from "@components/Center";
import LED from "@components/LED";
import Padding from "@components/Padding";

import useAppRegistrationsContext from "@hooks/useAppRegistrationsContext";
import useAppRuntimesContext from "@hooks/useAppRuntimesContext";

import consume from "@utils/consume";

export default function ApplicationSelector({
  searchQuery = "",
  onResetSearchQuery,
}) {
  const { appRegistrations } = useAppRegistrationsContext();
  const { appRuntimes, startAppRuntime } = useAppRuntimesContext();

  const appRuntimeRegistrations = useMemo(
    () => appRuntimes.map(runtime => runtime.getRegistration()),
    [appRuntimes]
  );

  // TODO: Move application search into a service and implement keyword-based
  // searching, other criteria
  const filteredRegistrations = useMemo(
    () =>
      appRegistrations.filter(registration =>
        !Boolean(searchQuery)
          ? true
          : registration
              .getTitle()
              .toUpperCase()
              .includes(searchQuery.toUpperCase())
      ),
    [appRegistrations, searchQuery]
  );

  if (searchQuery?.length && !filteredRegistrations.length) {
    return (
      <Center>
        <Padding style={{ fontWeight: "bold" }}>
          No applications found for search.
        </Padding>
        <Padding>
          <button onClick={onResetSearchQuery}>Reset Search Query</button>
        </Padding>
      </Center>
    );
  }

  return (
    <Center canOverflow={true}>
      <Padding>
        {filteredRegistrations.map(registration => {
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
      </Padding>
    </Center>
  );
}
