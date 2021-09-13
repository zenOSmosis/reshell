import Desktop from "@components/Desktop";

import MainWindow from "./apps/MainWindow";

/*
import {
  windowMonitor,
  EVT_UPDATED,
} from "../components/Window/classes/WindowController";
*/

/*
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
*/

export default function WizardPortal() {
  return <Desktop appDescriptors={[MainWindow]} />;
}
