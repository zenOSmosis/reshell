import LED from "../../components/LED";

import SocketIOService from "../services/SocketIOService";
import SocketAPIMockService from "../services/SocketAPIMockService";
import HostBridgeAPIMockService from "../services/HostBridgeAPIMockService";

const WizardMainWindow = {
  id: "reshell-setup-wizard",
  title: "ReShell Setup Wizard",
  style: {
    left: 10,
    top: 10,
    width: 640,
    height: 480,
  },
  serviceClasses: [
    SocketIOService,
    SocketAPIMockService,
    HostBridgeAPIMockService,
  ],
  view: function WizardMainView({ windowController, windowServices }) {
    const hasSocketIOService = Boolean(windowServices["SocketIOService"]);
    const isSocketConnected =
      hasSocketIOService && windowServices["SocketIOService"].getIsOnline();

    // TODO: Remove
    console.log({
      windowServices,
    });

    return (
      <div>
        <ul>
          <li>
            <LED color={windowServices ? "green" : "gray"} /> Service core
          </li>
          <li>
            <LED color={hasSocketIOService ? "green" : "gray"} /> Socket.io
            service
            <div>
              <LED color={isSocketConnected ? "green" : "gray"} />
              <button disabled={!hasSocketIOService}>
                {!isSocketConnected ? "Connect" : "Disconnect"}
              </button>
            </div>
          </li>
          <li>
            TODO: Host Bridge API / SocketAPI
            <div>
              <LED color="gray" />
              <button>View</button>
            </div>
          </li>
          <li>TODO: Filesystem bindings</li>
        </ul>
      </div>
    );
  },
};

export default WizardMainWindow;
