import Desktop from "@components/Desktop";

import AboutReshellWindow from "./windows/AboutReshellWindow";
import InputMediaDevicesWindow from "./windows/InputMediaDevicesWindow";
import TestVUMeterWindow from "./windows/TestVUMeterWindow";
import ScreenCaptureWindow from "./windows/ScreenCaptureWindow";

// import InputMediaDeviceSelectorView from "./views/InputMediaDeviceSelectorView";

// TODO: Update this

// TODO: Make this a service
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

export default function ExamplePortal() {
  return (
    <Desktop
      initialWindows={[
        AboutReshellWindow,
        InputMediaDevicesWindow,
        TestVUMeterWindow,
        ScreenCaptureWindow,
      ]}
    />
  );
}
