import Scrollable from "@components/Scrollable";
import StickyTable from "@components/StickyTable";
import Padding from "@components/Padding";
import Layout, { Header, Content, Footer } from "@components/Layout";

import PhantomClassMonitorService from "@services/PhantomClassMonitorService";

export const REGISTRATION_ID = "phantom-log-level-adjuster";

const PhantomLogLevelAdjusterApp = {
  id: REGISTRATION_ID,
  title: "Phantom Log Level Adjuster",
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
              <span>Global log level:</span>{" "}
              <select>
                <option>trace</option>
                <option>debug</option>
                <option>info</option>
                <option>warn</option>
                <option>error</option>
                <option>silent</option>
              </select>
            </div>
          </Padding>
        </Header>
        <Content>
          <Scrollable>
            <StickyTable>
              <thead>
                <tr>
                  <td>Phantom Class Name</td>

                  <td>Log Level</td>
                </tr>
              </thead>
              <tbody>
                {phantomClassNames.map(phantomClassName => (
                  <tr key={phantomClassName}>
                    <td>{phantomClassName}</td>
                    <td>
                      <select>
                        {
                          // TODO: Dynamically populate
                        }
                        <option>trace</option>
                        <option>debug</option>
                        <option>info</option>
                        <option>warn</option>
                        <option>error</option>
                        <option>silent</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StickyTable>
          </Scrollable>
        </Content>
        <Footer>
          <Padding>{phantomClassNames.length} unique</Padding>
        </Footer>
      </Layout>
    );
  },
};

export default PhantomLogLevelAdjusterApp;
