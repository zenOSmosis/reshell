import { useEffect, useState } from "react";
import Center from "../components/Center";
import Desktop from "../components/Desktop";
import LED from "../components/LED";

import {
  windowMonitor,
  EVT_UPDATED,
} from "../components/Window/classes/WindowController";

function WindowMonitorView() {
  const [lenWindows, setLenWindows] = useState(0);

  useEffect(() => {
    const _handleUpdate = () => {
      setLenWindows(windowMonitor.getChildren().length);
    };

    _handleUpdate();

    windowMonitor.on(EVT_UPDATED, _handleUpdate);

    return function unmount() {
      windowMonitor.off(EVT_UPDATED, _handleUpdate);
    };
  }, []);

  return (
    <div>
      Window Monitor<div>{lenWindows}</div>
    </div>
  );
}

export default function WizardApp() {
  return (
    <Desktop
      initialWindows={[
        {
          id: "reshell-setup-wizard",
          title: "ReShell Setup Wizard",
          style: {
            left: 10,
            top: 10,
            width: 640,
            height: 480,
          },
          // TODO: Use windowController in view context
          // TODO: Enable service spawning for Socket.io connection; show in right-hand side of desktop footer
          // TODO: Show service list in Desktop menu
          view: ({ windowController }) => (
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
          ),
        },

        // TODO: Add test window which can be changed between widget, clear, etc. modes
      ]}
    />
  );
}
