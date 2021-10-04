import Desktop from "@components/Desktop";

import Applications from "../ExamplePortal/apps/Applications";
import ApplicationMonitor from "../ExamplePortal/apps/ApplicationMonitor";
import AdditionWindow from "./apps/AdditionWindow";
import MultiplicationWindow from "./apps/MultiplicationWindow";
import TotalsWindow from "./apps/TotalsWindow";
import ArbitraryValuesWindow from "./apps/ArbitraryValuesWindow";

export default function WizardPortal() {
  return (
    <Desktop
      appDescriptors={[
        Applications,
        ApplicationMonitor,
        AdditionWindow,
        MultiplicationWindow,
        TotalsWindow,
        ArbitraryValuesWindow,
      ]}
    />
  );
}
