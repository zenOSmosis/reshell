import { useEffect, useState } from "react";
import Center from "../components/Center";
import Desktop from "../components/Desktop";

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
            <Center>
              [Host Bridge]{" "}
              <button onClick={() => windowController.destroy()}>Close</button>
              {
                // TODO: Remove or refactor
              }
              <button
                onClick={() =>
                  console.log({
                    windowController,
                    title: windowController.getTitle(),
                  })
                }
              >
                Log
              </button>
              {
                // TODO: Remove
              }
              <button onClick={() => windowController.setTitle("hello!")}>
                Change Title
              </button>
            </Center>
          ),
        },

        // TODO: Add test window which can be changed between widget, clear, etc. modes
      ]}
    />
  );
}
