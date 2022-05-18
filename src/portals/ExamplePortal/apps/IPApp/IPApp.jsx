import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import Padding from "@components/Padding";

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
    const ipAddress = networkStatusMonitorService.getIPAddress();

    return (
      <Layout>
        <Content>
          <Center>
            {isOnline ? (
              <div>IP Address: {ipAddress || "N/A"}</div>
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
