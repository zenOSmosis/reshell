import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import Padding from "@components/Padding";
import StickyTable from "@components/StickyTable";

import LabeledLED from "@components/labeled/LabeledLED";

import NetworkStatusMonitorService from "@services/NetworkStatusMonitorService";

export const REGISTRATION_ID = "ip";

const HelloWorldApp = {
  id: REGISTRATION_ID,
  title: "IP",
  style: {
    width: 320,
    height: 240,
  },
  serviceClasses: [NetworkStatusMonitorService],
  view: function View({ appServices }) {
    const networkStatusMonitorService =
      appServices[NetworkStatusMonitorService];

    const isOnline = networkStatusMonitorService.getIsOnline();
    // const isFetchingIPInfo = networkStatusMonitorService.getIsFetchingIPInfo();
    const ipData = networkStatusMonitorService.getData();

    return (
      <Layout>
        <Content>
          <Center canOverflow>
            {isOnline ? (
              <StickyTable>
                <thead>
                  <tr>
                    <td>Key</td>
                    <td>Value</td>
                  </tr>
                </thead>
                <tbody>
                  {ipData &&
                    Object.entries(ipData)
                      .filter(
                        ([key]) =>
                          ![
                            "uag",
                            "fl",
                            "h",
                            "visit_scheme",
                            "tls",
                            "sni",
                            "warp",
                          ].includes(key)
                      )
                      .map(([key, value]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>{value}</td>
                        </tr>
                      ))}
                </tbody>
              </StickyTable>
            ) : (
              <div style={{ fontWeight: "bold" }}>Not online</div>
            )}
          </Center>
        </Content>

        <Footer>
          <Padding>
            <LabeledLED
              style={{ float: "right" }}
              color={isOnline ? "green" : "red"}
              label="Internet"
            />
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default HelloWorldApp;
