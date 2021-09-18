// NOTE: No hook is wrapped directly around this because the goal is to not
// make it easy to expose services to windows which don't directly use said
// service
import { useContext } from "react";
import { UIServicesContext } from "@core/BaseView/providers/UIServicesProvider";

// TODO: Include (either here, or elsewhere,) ability to monitor running
// PhantomCore instances (use WeakRef here or there, as well)?

// TODO: Include ability to render service reporters, once functionality is
// integrated

// TODO: Include ability to monitor React providers exposed by the service

import Timer from "@components/Timer";

const ServiceMonitor = {
  id: "service-monitor",
  title: "Service Monitor",
  style: {
    left: "auto",
    bottom: 0,
    width: 640,
    height: 480,
  },
  isPinned: true,
  view: function View() {
    const { services } = useContext(UIServicesContext);

    // TODO: Group by runtime

    return (
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <td>Service Name</td>
            <td>Uptime</td>
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
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service.getUUID()}>
              <td>{service.getTitle() || "[Untitled]"}</td>
              <td className="center">
                <Timer onTick={() => service.getInstanceUptime()} />
              </td>
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
              <td className="center">N/A</td>
              <td className="center">N/A</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};

export default ServiceMonitor;
