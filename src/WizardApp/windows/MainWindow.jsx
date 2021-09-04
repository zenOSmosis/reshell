import { useEffect } from "react";
import LED from "../../components/LED";

// TODO: Move to service
import io from "socket.io-client";

const WizardMainWindow = {
  id: "reshell-setup-wizard",
  title: "ReShell Setup Wizard",
  style: {
    left: 10,
    top: 10,
    width: 640,
    height: 480,
  },
  // services: []
  // TODO: Enable service spawning for Socket.io connection; show in right-hand side of desktop footer
  // TODO: Show service list in Desktop menu
  view: function WizardMainView({ windowController }) {
    // TODO: Remove
    useEffect(() => {
      console.log("useEffect");
    }, []);

    return (
      <div>
        <ul>
          <li>
            TODO: Service core
            <div>
              <LED color="gray" /> <button>Start</button>
            </div>
          </li>
          <li>
            TODO: Socket.io service
            <div>
              <LED color="gray" />
              <button>Connect</button>
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
