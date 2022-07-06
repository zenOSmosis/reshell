import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import Padding from "@components/Padding";
import AppLinkButton from "@components/AppLinkButton";
import Timer from "@components/Timer";

import ReShellCore from "@core";

import { REGISTRATION_ID as APPLICATION_MONITOR_REGISTRATION_ID } from "../ApplicationMonitorApp";
import { REGISTRATION_ID as SERVICE_MONITOR_REGISTRATION_ID } from "../ServiceMonitorApp";

export const REGISTRATION_ID = "uptime";

const UptimeApp = {
  id: REGISTRATION_ID,
  title: "Uptime",
  style: {
    width: 180,
    height: 120,
  },
  view: () => {
    return (
      <Layout>
        <Content>
          <Center canOverflow={true}>
            <Timer
              onTick={ReShellCore.getReShellUptime}
              style={{ fontWeight: "bold" }}
            />
          </Center>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          <Padding>
            <AppLinkButton
              id={APPLICATION_MONITOR_REGISTRATION_ID}
              style={{ float: "left" }}
            />
            <AppLinkButton
              id={SERVICE_MONITOR_REGISTRATION_ID}
              style={{ float: "right" }}
            />
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default UptimeApp;
