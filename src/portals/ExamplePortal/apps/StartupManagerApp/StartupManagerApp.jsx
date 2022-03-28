import { useMemo } from "react";

import Full from "@components/Full";
import Center from "@components/Center";
import Padding from "@components/Padding";
import Layout, { Header, Content } from "@components/Layout";
import StickyTable from "@components/StickyTable";

import AppOrchestrationService from "@services/AppOrchestrationService";
import AppAutoStartService from "@services/AppAutoStartService";

export const REGISTRATION_ID = "startup-manager";

const StartupManagerApp = {
  id: REGISTRATION_ID,
  title: "Startup Manager",
  style: {
    width: 420,
    height: 480,
  },
  serviceClasses: [AppOrchestrationService, AppAutoStartService],
  view: function View({ appServices }) {
    const appOrchestrationService = appServices[AppOrchestrationService];
    const appRegistrations = appOrchestrationService.getAppRegistrations();

    const appAutoStartService = appServices[AppAutoStartService];
    const appAutoStartConfigs = appAutoStartService.getAutoStartConfigs();

    /**
     * @type {number[]} An array of available priority values.
     */
    const priorities = useMemo(
      () => Array.from(Array(100 / 5 + 1).keys()).map(key => key * 5),
      []
    );

    return (
      <Layout>
        <Header>
          <Padding>
            <Center>
              Choose the applications that should start up automatically when
              ReShell starts.
            </Center>
          </Padding>
        </Header>
        <Content>
          <Full style={{ overflowY: "auto" }}>
            <StickyTable>
              <thead>
                <tr>
                  <td>
                    {
                      // Intentionally blank
                    }
                  </td>
                  <td>
                    <Padding>Title</Padding>
                  </td>
                  <td>
                    <Padding>Priority</Padding>
                  </td>
                </tr>
              </thead>
              <tbody>
                {appRegistrations.map(registration => {
                  const metadata =
                    appAutoStartConfigs[registration.getAppDescriptorID()];
                  const isAutoStart = Boolean(metadata);
                  const priority = metadata?.priority;

                  return (
                    <tr key={registration.getUUID()}>
                      <td>
                        <Padding>
                          <Center>
                            <input
                              type="checkbox"
                              onChange={evt => {
                                // TODO: Refactor
                                const isChecked = evt.target.checked;

                                if (isChecked) {
                                  appAutoStartService.setAutoStartAppRegistration(
                                    registration
                                  );
                                } else {
                                  appAutoStartService.removeAutoStartAppRegistration(
                                    registration
                                  );
                                }
                              }}
                              checked={isAutoStart}
                            />
                          </Center>
                        </Padding>
                      </td>
                      <td>
                        <Padding>{registration.getTitle()}</Padding>
                      </td>
                      <td>
                        <Padding>
                          <select
                            disabled={!isAutoStart}
                            value={priority ? priority.toString() : ""}
                            onChange={evt =>
                              appAutoStartService.setAutoStartAppRegistration(
                                registration,
                                parseInt(evt.target.value, 10)
                              )
                            }
                          >
                            {isAutoStart ? (
                              <>
                                {priorities.map(priority => (
                                  <option
                                    key={priority}
                                    value={priority.toString()}
                                  >
                                    {priority}
                                  </option>
                                ))}
                              </>
                            ) : (
                              <option>N/A</option>
                            )}
                          </select>
                        </Padding>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </StickyTable>
          </Full>
        </Content>
      </Layout>
    );
  },
};

export default StartupManagerApp;
