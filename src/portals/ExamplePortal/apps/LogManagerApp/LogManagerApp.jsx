import Scrollable from "@components/Scrollable";
import StickyTable from "@components/StickyTable";
import Padding from "@components/Padding";
import Layout, { Header, Content, Footer } from "@components/Layout";

import SelectLogLevel from "./components/SelectLogLevel";

import PhantomClassMonitorService from "@services/PhantomClassMonitorService";

export const REGISTRATION_ID = "log-manager";

// TODO: Implement ability to select by hierarchy

const LogManagerApp = {
  id: REGISTRATION_ID,
  title: "Log Manager",
  style: {
    width: 640,
    height: 480,
  },
  serviceClasses: [PhantomClassMonitorService],
  view: function View({ appServices }) {
    const phantomMonitor = appServices[PhantomClassMonitorService];

    const phantomClassNames = phantomMonitor.getPhantomClassNames();

    // TODO: Retain log level settings in local storage

    return (
      <Layout>
        <Header style={{ textAlign: "center" }}>
          <Padding>
            <div>
              <span style={{ fontWeight: "bold" }}>Global log level:</span>{" "}
              <SelectLogLevel
                value={phantomMonitor.getGlobalLogLevel()}
                onChange={phantomMonitor.setGlobalLogLevel}
              />{" "}
              <button
                onClick={phantomMonitor.resetGlobalLogLevel}
                disabled={!phantomMonitor.getHasGlobalLogLevelChanged()}
              >
                Reset
              </button>
            </div>
          </Padding>
        </Header>
        <Content>
          <Scrollable>
            <StickyTable>
              <thead>
                <tr>
                  <td>
                    <Padding>Phantom Class Name</Padding>
                  </td>

                  <td>
                    <Padding>Instances</Padding>
                  </td>

                  <td>
                    <Padding>Log Level</Padding>
                  </td>
                </tr>
              </thead>
              <tbody>
                {phantomClassNames.map(phantomClassName => (
                  <tr key={phantomClassName}>
                    <td>
                      <Padding>{phantomClassName}</Padding>
                    </td>
                    <td>
                      <Padding>
                        {phantomMonitor.getTotalPhantomInstancesWithClassName(
                          phantomClassName
                        )}
                      </Padding>
                    </td>
                    <td>
                      <Padding>
                        <SelectLogLevel
                          // TODO: Refactor value and onChange handlers
                          value={phantomMonitor.getPhantomClassLogLevel(
                            phantomClassName
                          )}
                          onChange={logLevel =>
                            phantomMonitor.setPhantomClassLogLevel(
                              phantomClassName,
                              logLevel
                            )
                          }
                        />
                      </Padding>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StickyTable>
          </Scrollable>
        </Content>
        <Footer>
          <Padding>{phantomMonitor.getTotalPhantomInstances()} unique</Padding>
        </Footer>
      </Layout>
    );
  },
};

export default LogManagerApp;
