// NOTE: No hook is wrapped directly around this because the goal is to not
// make it easy to expose services to windows which don't directly use said
// service

import PhantomCore from "phantom-core";

import { useContext } from "react";
import StickyTable from "@components/StickyTable";
import Layout, { Content, Footer } from "@components/Layout";
import Full from "@components/Full";
import Padding from "@components/Padding";
import Timer from "@components/Timer";
import NoWrap from "@components/NoWrap";
import AppLinkButton from "@components/AppLinkButton";

import { UIServicesContext } from "@core/providers/UIServicesProvider";

import { REGISTRATION_ID as APPLICATION_MONITOR_REGISTRATION_ID } from "./ApplicationMonitorApp";

// TODO: Include (either here, or elsewhere,) ability to monitor running
// PhantomCore instances (use WeakRef here or there, as well)?

// TODO: Include links to apps which are using this service

// TODO: Show last update time, state, etc.

// TODO: Include ability to render service reporters, once functionality is
// integrated

export const REGISTRATION_ID = "service-monitor";

const ServiceMonitorApp = {
  id: REGISTRATION_ID,
  title: "Service Monitor",
  style: {
    width: 640,
    height: 480,
  },
  isPinned: true,
  view: function View() {
    const { services } = useContext(UIServicesContext);

    // TODO: Group by runtime

    return (
      <Layout>
        <Content>
          <Full style={{ overflowY: "auto" }}>
            <StickyTable style={{ width: "100%" }}>
              <thead>
                <tr>
                  <td>
                    <Padding>Service Name</Padding>
                  </td>
                  <td>
                    <Padding>Uptime</Padding>
                  </td>
                  <td>
                    <Padding>f(x)</Padding>
                  </td>
                  {/**
              <td>
                Active
                <br />
                App Runtimes
              </td>
              <td>
                Dynamically
                <br />
                Linked Providers
              </td>  
               */}
                </tr>
              </thead>
              <tbody>
                {services.map(service => (
                  <tr key={service.getUUID()}>
                    <td>
                      <Padding>{service.getTitle() || "[Untitled]"}</Padding>
                    </td>
                    <td className="center">
                      <Timer onTick={() => service.getInstanceUptime()} />
                    </td>
                    {/*
                  <td className="center">N/A</td>
                  <td className="center">N/A</td>
                  */}
                    {/*
              <td>
                <button
                  onClick={() => service.destroy()}
                  style={{ width: "100%" }}
                >
                  Close
                </button>
              </td>
                */}
                    <td className="center">
                      {
                        // TODO: Remove
                      }
                      <Padding>
                        <button onClick={() => service.log(service.getState())}>
                          <NoWrap>log(state)</NoWrap>
                        </button>
                      </Padding>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StickyTable>
          </Full>
        </Content>
        <Footer>
          <hr style={{ margin: 0, padding: 0 }} />
          <Padding>
            <Full>
              <div style={{ position: "absolute", bottom: 0, left: 0 }}>
                PhantomCore uptime:{" "}
                <Timer onTick={() => PhantomCore.getUptime()} />
              </div>
              <AppLinkButton
                id={APPLICATION_MONITOR_REGISTRATION_ID}
                style={{ float: "right", verticalAlign: "bottom" }}
              />
            </Full>
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default ServiceMonitorApp;
