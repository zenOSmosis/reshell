// NOTE: No hook is wrapped directly around this because the goal is to not
// make it easy to expose services to windows which don't directly use said
// service
import { useContext } from "react";
import { UIServicesContext } from "@core/BaseView/providers/UIServicesProvider";

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
        <tbody>
          {services.map((service) => (
            <tr key={service.getUUID()}>
              <td className="center">
                <input type="checkbox" />
              </td>
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
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};

export default ServiceMonitor;
