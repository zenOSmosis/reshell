import Desktop from "@components/Desktop";

import ApplicationsApp from "../ExamplePortal/apps/ApplicationsApp";
import ApplicationMonitorApp from "../ExamplePortal/apps/ApplicationMonitorApp";
import ServiceMonitorApp from "../ExamplePortal/apps/ServiceMonitorApp";
import AdditionApp from "./apps/AdditionApp";
import MultiplicationApp from "./apps/MultiplicationApp";
import TotalsApp from "./apps/TotalsApp";
import ArbitraryValuesApp from "./apps/ArbitraryValuesApp";

export default function WizardPortal() {
  return (
    <Desktop
      appDescriptors={[
        ApplicationsApp,
        ApplicationMonitorApp,
        ServiceMonitorApp,
        AdditionApp,
        MultiplicationApp,
        TotalsApp,
        ArbitraryValuesApp,
      ]}
    />
  );
}
