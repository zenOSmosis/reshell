import Desktop from "@components/Desktop";

import AdditionWindow from "./apps/AdditionWindow";
import MultiplicationWindow from "./apps/MultiplicationWindow";
import TotalsWindow from "./apps/TotalsWindow";
import ArbitraryValuesWindow from "./apps/ArbitraryValuesWindow";

export default function WizardPortal() {
  return (
    <Desktop
      appDescriptors={[
        AdditionWindow,
        MultiplicationWindow,
        TotalsWindow,
        ArbitraryValuesWindow,
      ]}
    />
  );
}
